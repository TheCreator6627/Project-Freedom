const express = require("express");
const router = express.Router();
const { generateMerkleTree, getMerkleProof } = require("../merkle/generator");
const MerkleRoot = require("../models/MerkleRoot");
const logger = require("../utils/logger");

// @route   GET /api/allowlist/proof
// @desc    Gibt einen Merkle-Proof für einen Benutzer und eine spezifische Liste zurück
router.get("/proof", async (req, res) => {
  // Wir erwarten jetzt listName statt tokenId, da der Name im Admin-Panel vergeben wird
  const { walletAddress, listName } = req.query;

  if (!walletAddress || !listName) {
    return res
      .status(400)
      .json({ msg: "Adresse und Listenname sind erforderlich." });
  }

  try {
    const allowlist = await MerkleRoot.findOne({
      name: { $regex: `^${listName}$`, $options: "i" },
    });

    if (!allowlist) {
      logger.warn(`Allowlist "${listName}" nicht gefunden.`);
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
    logger.error(err, "Fehler bei der Proof-Erstellung");
    res.status(500).send("Server-Fehler");
  }
});

module.exports = router;
