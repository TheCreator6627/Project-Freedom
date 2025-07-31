// backend/routes/admin.js

const express = require("express");
const router = express.Router();
const { generateMerkleTree } = require("../merkle/generator");
const MerkleRoot = require("../models/MerkleRoot");
const { protectAdmin } = require("../middleware/auth"); // <-- Middleware importieren

// HIER: Alle Routen in dieser Datei werden jetzt durch die protectAdmin-Funktion geschützt
router.use(protectAdmin);

// @route   POST api/admin/generate-merkle
// @desc    Generiert einen Merkle Root (jetzt geschützt)
router.post("/generate-merkle", async (req, res) => {
  // ... (Die Logik von vorher bleibt hier unverändert)
  const { name, walletAddresses } = req.body;
  if (
    !name ||
    !walletAddresses ||
    !Array.isArray(walletAddresses) ||
    walletAddresses.length === 0
  ) {
    return res
      .status(400)
      .json({ msg: "Bitte einen Namen und eine Liste von Adressen angeben." });
  }
  try {
    const { root } = generateMerkleTree(walletAddresses);
    let existingRoot = await MerkleRoot.findOne({ name });
    if (existingRoot) {
      return res.status(400).json({
        msg: `Ein Merkle Root mit dem Namen "${name}" existiert bereits.`,
      });
    }
    const newMerkleRoot = new MerkleRoot({ name, root });
    await newMerkleRoot.save();
    res.status(201).json({
      msg: "Merkle Root erfolgreich generiert und gespeichert.",
      merkleRoot: newMerkleRoot,
    });
  } catch (err) {
    console.error(err); // <-- Gibt das ganze Fehlerobjekt aus
    res.status(500).send("Server-Fehler");
  }
});

// @route   GET api/admin/merkle-roots
// @desc    Zeigt alle gespeicherten Merkle Roots an (Monitoring)
router.get("/merkle-roots", async (req, res) => {
  try {
    const roots = await MerkleRoot.find().sort({ createdAt: -1 }); // Neueste zuerst
    res.json(roots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server-Fehler");
  }
});

module.exports = router;
