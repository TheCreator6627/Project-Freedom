const cron = require("node-cron");
const { Alchemy, Network, AssetTransfersCategory } = require("alchemy-sdk");
const MerkleRoot = require("../models/MerkleRoot");
const { generateMerkleTree } = require("../merkle/generator");
const logger = require("../utils/logger");
const contracts = require("../lib/contracts");

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  // Passe dies an, wenn du auf dem BNB Mainnet oder einem anderen Netzwerk arbeitest
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);

/**
 * Analysiert die Blockchain, um Adressen zu finden, die einen Token für eine bestimmte Dauer gehalten haben.
 * @param {string} tokenContractAddress - Die Adresse des ERC20-Token-Vertrags.
 * @param {number} requiredHoldingDays - Die erforderliche Haltedauer in Tagen.
 * @returns {Promise<string[]>} Ein Array der berechtigten Wallet-Adressen.
 */
const getLoyalHolders = async (tokenContractAddress, requiredHoldingDays) => {
  logger.info(`Starte Snapshot für Token: ${tokenContractAddress}...`);
  const requiredHoldingSeconds = requiredHoldingDays * 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);

  try {
    const allTransfers = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toBlock: "latest",
      contractAddresses: [tokenContractAddress],
      category: [AssetTransfersCategory.ERC20],
      withMetadata: true,
    });

    logger.info(
      `${allTransfers.transfers.length} Transfers gefunden. Analysiere Haltedauer...`
    );

    const holderTimelines = new Map();

    for (const transfer of allTransfers.transfers) {
      const timestamp =
        new Date(transfer.metadata.blockTimestamp).getTime() / 1000;
      const value = BigInt(transfer.rawContract.value || "0");
      const from = transfer.from;
      const to = transfer.to;

      // Abgang: Setzt die Haltedauer zurück
      if (holderTimelines.has(from)) {
        holderTimelines.set(from, { firstTxTimestamp: now, balance: 0n });
      }

      // Zugang
      if (!holderTimelines.has(to)) {
        holderTimelines.set(to, {
          firstTxTimestamp: timestamp,
          balance: value,
        });
      } else {
        const current = holderTimelines.get(to);
        holderTimelines.set(to, {
          ...current,
          balance: current.balance + value,
        });
      }
    }

    const loyalHolders = [];
    for (const [address, data] of holderTimelines.entries()) {
      const holdingDuration = now - data.firstTxTimestamp;
      if (
        address !== "0x0000000000000000000000000000000000000000" &&
        data.balance > 0 &&
        holdingDuration >= requiredHoldingSeconds
      ) {
        loyalHolders.push(address);
      }
    }

    logger.info(
      `Analyse abgeschlossen. ${loyalHolders.length} treue Halter gefunden.`
    );
    return loyalHolders;
  } catch (error) {
    logger.error(
      error,
      `Fehler bei der Abfrage der Asset-Transfers für ${tokenContractAddress}`
    );
    return []; // Gib ein leeres Array zurück, um den Job nicht abstürzen zu lassen
  }
};

const runSnapshot = async () => {
  try {
    const tokenContractAddress = contracts.fToken.address;
    const loyalHolders = await getLoyalHolders(tokenContractAddress, 365);

    if (loyalHolders.length === 0) {
      logger.info(
        "Keine Adressen erfüllen die Kriterien. Kein neuer Merkle Root erstellt."
      );
      return;
    }

    const listName = `Airdrop-Jahr-1-${new Date().toISOString().split("T")[0]}`;
    const { root } = generateMerkleTree(loyalHolders);
    const existingRoot = await MerkleRoot.findOne({ name: listName });

    if (existingRoot) {
      logger.warn(`Merkle Root für "${listName}" existiert bereits.`);
      return;
    }

    const newMerkleRoot = new MerkleRoot({
      name: listName,
      root: root,
      walletAddresses: loyalHolders,
    });
    await newMerkleRoot.save();
    logger.info(
      `Erfolgreich! Neuer Merkle Root "${listName}" mit ${loyalHolders.length} Adressen gespeichert.`
    );
  } catch (error) {
    logger.error(
      { error: error.message, stack: error.stack },
      "Fehler während des Snapshot-Jobs"
    );
  }
};

// Plane den Job so, dass er täglich um 2 Uhr nachts läuft.
const scheduledJob = cron.schedule("0 2 * * *", runSnapshot, {
  scheduled: false,
});

const start = () => {
  logger.info(
    "Snapshot-Job wurde initialisiert und wartet auf seinen Zeitplan."
  );
  scheduledJob.start();
};

module.exports = { start, runSnapshot };
