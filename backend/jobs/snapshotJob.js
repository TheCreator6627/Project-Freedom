const cron = require('node-cron');
const { Alchemy, Network, AssetTransfersCategory } = require('alchemy-sdk');
const MerkleRoot = require('../models/MerkleRoot');
const { generateMerkleTree } = require('../merkle/generator');
const logger = require('../utils/logger');
const contracts = require('../lib/contracts'); // <-- Importiert die zentrale Vertrags-Datei

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA, // Bedenke, dies ggf. zu Network.BNB_TESTNET zu ändern
};
const alchemy = new Alchemy(config);

const getLoyalHolders = async (tokenContractAddress, requiredHoldingDays) => {
  logger.info(`Starte Snapshot für ${tokenContractAddress}...`);
  const requiredHoldingSeconds = requiredHoldingDays * 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);

  const allTransfers = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toBlock: "latest",
    contractAddresses: [tokenContractAddress],
    category: [AssetTransfersCategory.ERC20],
    withMetadata: true,
  });

  logger.info(`${allTransfers.transfers.length} Transfers gefunden. Analysiere Haltedauer...`);

  const holderTimelines = new Map();

  for (const transfer of allTransfers.transfers) {
    const timestamp = new Date(transfer.metadata.blockTimestamp).getTime() / 1000;
    const value = BigInt(transfer.rawContract.value || '0');
    const from = transfer.from;
    const to = transfer.to;

    if (holderTimelines.has(from)) {
        holderTimelines.set(from, { firstTxTimestamp: now, balance: 0n });
    }

    if (!holderTimelines.has(to)) {
        holderTimelines.set(to, { firstTxTimestamp: timestamp, balance: value });
    } else {
        const current = holderTimelines.get(to);
        holderTimelines.set(to, { ...current, balance: current.balance + value });
    }
  }

  const loyalHolders = [];
  for (const [address, data] of holderTimelines.entries()) {
    const holdingDuration = now - data.firstTxTimestamp;
    if (address !== '0x0000000000000000000000000000000000000000' && data.balance > 0 && holdingDuration >= requiredHoldingSeconds) {
      loyalHolders.push(address);
    }
  }
  
  logger.info(`Analyse abgeschlossen. ${loyalHolders.length} treue Halter gefunden.`);
  return loyalHolders;
};

const runSnapshot = async () => {
  try {
    const tokenContractAddress = contracts.fToken.address; // <-- Benutzt die zentrale Adresse
    const loyalHolders = await getLoyalHolders(tokenContractAddress, 365);

    if (loyalHolders.length === 0) {
      logger.info('Keine Adressen erfüllen die Kriterien. Kein neuer Merkle Root erstellt.');
      return;
    }

    const listName = `Airdrop-Jahr-1-${new Date().toISOString().split('T')[0]}`;
    const { root } = generateMerkleTree(loyalHolders);
    const existingRoot = await MerkleRoot.findOne({ name: listName });

    if (existingRoot) {
      logger.warn(`Merkle Root für "${listName}" existiert bereits.`);
      return;
    }

    const newMerkleRoot = new MerkleRoot({ name: listName, root: root, walletAddresses: loyalHolders });
    await newMerkleRoot.save();
    logger.info(`Erfolgreich! Neuer Merkle Root "${listName}" mit ${loyalHolders.length} Adressen gespeichert.`);

  } catch (error) {
    logger.