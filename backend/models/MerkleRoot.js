// backend/models/MerkleRoot.js

const mongoose = require("mongoose");

const MerkleRootSchema = new mongoose.Schema({
  // Der eigentliche Merkle Root Hash
  root: {
    type: String,
    required: [true, "Ein Merkle Root Hash ist erforderlich."],
    unique: true, // Stellt sicher, dass kein Root-Hash doppelt gespeichert wird
  },
  // Ein Name, um diesen Root zu identifizieren (z.B. "Phase 1 Allowlist")
  name: {
    type: String,
    required: [true, "Ein Name für den Merkle Root ist erforderlich."],
    unique: true, // Stellt sicher, dass jeder Name nur einmal verwendet wird
  },
  // HIER IST DIE KORREKTUR: Das Feld zum Speichern der Adressen
  walletAddresses: {
    type: [String], // Definiert das Feld als Array von Strings
    required: true, // Macht die Liste der Adressen zu einem Pflichtfeld
  },
  // Ein Zeitstempel, wann dieser Root erstellt wurde
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MerkleRoot", MerkleRootSchema);
