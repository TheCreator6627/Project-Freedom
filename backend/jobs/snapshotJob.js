// backend/jobs/snapshotJob.js
const cron = require("node-cron");
const { Alchemy, Network, AssetTransfersCategory } = require("alchemy-sdk"); // AssetTransfersCategory importieren
const MerkleRoot = require("../models/MerkleRoot");
const { generateMerkleTree } = require("../merkle/generator");
const logger = require("../utils/logger"); // Unseren Pino-Logger verwenden

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA, // Bedenke, dies zu Network.BNB_TESTNET zu ändern, wenn du auf dem BNB Testnet bist
};
const alchemy = new Alchemy(config);

/**
 * Analysiert die Blockchain, um Adressen zu finden, die einen Token für eine bestimmte Dauer gehalten haben.
 */
const getLoyalHolders = async (tokenContractAddress, requiredHoldingDays) => {
  logger.info(`Starte Snapshot für ${tokenContractAddress}...`);
  const requiredHoldingSeconds = requiredHoldingDays * 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);

  // 1. Alle Transfers für den Token-Vertrag holen
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

  // 2. Salden und erste Transaktionszeitpunkte für jeden Halter verfolgen
  const holderTimelines = new Map();

  for (const transfer of allTransfers.transfers) {
    const timestamp =
      new Date(transfer.metadata.blockTimestamp).getTime() / 1000;
    const value = BigInt(transfer.rawContract.value || "0");
    const from = transfer.from;
    const to = transfer.to;

    // Abgang: Wenn ein Halter sendet, wird seine Haltedauer zurückgesetzt
    if (holderTimelines.has(from)) {
      holderTimelines.set(from, { firstTxTimestamp: now, balance: 0n }); // Reset
    }

    // Zugang: Wenn ein Halter empfängt
    if (!holderTimelines.has(to)) {
      holderTimelines.set(to, { firstTxTimestamp: timestamp, balance: value });
    } else {
      const current = holderTimelines.get(to);
      holderTimelines.set(to, { ...current, balance: current.balance + value });
    }
  }

  // 3. Adressen filtern, die die Kriterien erfüllen
  const loyalHolders = [];
  for (const [address, data] of holderTimelines.entries()) {
    const holdingDuration = now - data.firstTxTimestamp;
    // Ignoriere Burn-Adresse und andere spezielle Adressen
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
};

const runSnapshot = async () => {
  try {
    const tokenContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Deine F-Token Adresse
    const loyalHolders = await getLoyalHolders(tokenContractAddress, 365); // Beispiel für 365 Tage

    if (loyalHolders.length === 0) {
      logger.info(
        "Keine Adressen erfüllen die Kriterien. Kein neuer Merkle Root erstellt."
      );
      return;
    }

    // ... (Der Rest der Funktion zum Speichern des Merkle Roots bleibt gleich)
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

const scheduledJob = cron.schedule("0 2 * * *", runSnapshot, {
  scheduled: false,
});
const start = () => {
  logger.info(
    "Snapshot-Job wurde initialisiert und wartet auf seinen Zeitplan."
  );
  scheduledJob.start();
};
module.exports = { start, runSnapshot }; // runSnapshot exportieren, um es manuell testen zu können
