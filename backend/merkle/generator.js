const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

// Diese Funktion generiert den Merkle Tree und den Root Hash
function generateMerkleTree(walletAddresses) {
  // 1. Blätter (Leaves) erstellen: Jede Adresse wird gehasht.
  const leaves = walletAddresses.map((address) => keccak256(address));

  // 2. Den Baum erstellen: Die gehashten Blätter werden zum Baum zusammengefügt.
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  // 3. Den Root Hash holen: Das ist die "Wurzel" des Baumes.
  const root = tree.getRoot().toString("hex");

  // Wir geben den Baum und den Root zurück
  return { tree, root };
}

// Diese Funktion generiert einen Beweis (Proof) für eine einzelne Adresse
function getMerkleProof(tree, walletAddress) {
  const leaf = keccak256(walletAddress);
  const proof = tree.getHexProof(leaf);
  return proof;
}

module.exports = { generateMerkleTree, getMerkleProof };
