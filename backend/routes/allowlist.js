// backend/routes/allowlist.js
const express = require("express");
const router = express.Router();
const { generateMerkleTree, getMerkleProof } = require("../merkle/generator");
const MerkleRoot = require("../models/MerkleRoot");

// @route   GET /api/allowlist/proof
// @desc    Gibt einen Merkle-Proof für einen Benutzer zurück
router.get("/proof", async (req, res) => {
  const { walletAddress, listName } = req.query;

  if (!walletAddress || !listName) {
    return res
      .status(400)
      .json({ msg: "Adresse und Listenname sind erforderlich." });
  }
try {
  // Diese neue Suche ignoriert Groß-/Kleinschreibung und sucht exakt.
  const allowlist = await MerkleRoot.findOne({
    name: { $regex: `^${listName}$`, $options: "i" },
  });

  if (!allowlist) {
    // Wenn immer noch nichts gefunden wird, existiert sie wirklich nicht.
    return res.status(404).json({ msg: "Allowlist nicht gefunden." });
  }

  const lowerCaseAddress = walletAddress.toLowerCase();

  if (!allowlist.walletAddresses.includes(lowerCaseAddress)) {
    return res
      .status(404)
      .json({ msg: "Du stehst nicht auf dieser Allowlist." });
  }

  const { tree } = generateMerkleTree(allowlist.walletAddresses);
  const proof = getMerkleProof(tree, lowerCaseAddress);

  return res.json({ proof });
} catch (err) {
  console.error(err);
  res.status(500).send("Server-Fehler");
}

module.exports = router;
})