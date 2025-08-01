// backend/jobs/processors/snapshotProcessor.js
const MerkleRoot = require("../../models/merkleRoot");
const { generateMerkleTree } = require("../../merkle/generator");
const logger = require("../../utils/logger");

// Diese Funktion wird vom Worker für jeden Job aufgerufen
module.exports = async (job) => {
  const { name, walletAddresses } = job.data;

  logger.info(
    { job: job.id, name },
    `Verarbeite Job zur Merkle-Root-Generierung für "${name}"...`
  );

  const { root } = generateMerkleTree(walletAddresses);

  const existingRoot = await MerkleRoot.findOne({ name });
  if (existingRoot) {
    throw new Error(
      `Ein Merkle Root mit dem Namen "${name}" existiert bereits.`
    );
  }

  const newMerkleRoot = new MerkleRoot({ name, root, walletAddresses });
  await newMerkleRoot.save();

  return { root, name, count: walletAddresses.length };
};
