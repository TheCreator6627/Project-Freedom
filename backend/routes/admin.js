// backend/routes/admin.js

const express = require("express");
const router = express.Router();
const { generateMerkleTree } = require("../merkle/generator");
const MerkleRoot = require("../models/MerkleRoot");
const { protectAdmin } = require("../middleware/auth"); // Middleware importieren

// Alle Routen in dieser Datei werden jetzt durch die protectAdmin-Funktion geschützt
router.use(protectAdmin);

/**
 * @route   POST api/admin/generate-merkle
 * @desc    Generiert einen Merkle Tree, speichert den Root und die Adressen
 * @access  Private (Admin)
 */
router.post("/generate-merkle", async (req, res) => {
  const { name, walletAddresses } = req.body;

  // Validierung der Eingabe
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
    // Prüfen, ob bereits ein Root mit diesem Namen existiert
    let existingRoot = await MerkleRoot.findOne({ name });
    if (existingRoot) {
      return res.status(400).json({
        msg: `Ein Merkle Root mit dem Namen "${name}" existiert bereits.`,
      });
    }

    // Merkle Tree generieren
    const { root } = generateMerkleTree(walletAddresses);

    // Neues Merkle-Root-Dokument erstellen und speichern
    const newMerkleRoot = new MerkleRoot({
      name,
      root,
      walletAddresses, // HIER: Das Array wird jetzt mitgespeichert
    });

    await newMerkleRoot.save();

    res.status(201).json({
      msg: "Merkle Root erfolgreich generiert und gespeichert.",
      merkleRoot: newMerkleRoot,
    });
  } catch (err) {
    console.error("Fehler beim Generieren des Merkle Roots:", err);
    res.status(500).send("Server-Fehler");
  }
});

/**
 * @route   GET api/admin/merkle-roots
 * @desc    Zeigt alle gespeicherten Merkle Roots an (Monitoring)
 * @access  Private (Admin)
 */
router.get("/merkle-roots", async (req, res) => {
  try {
    const roots = await MerkleRoot.find().sort({ createdAt: -1 }); // Neueste zuerst
    res.json(roots);
  } catch (err) {
    console.error("Fehler beim Abrufen der Merkle Roots:", err);
    res.status(500).send("Server-Fehler");
  }
});

module.exports = router;
