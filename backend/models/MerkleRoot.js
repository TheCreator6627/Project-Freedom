const mongoose = require("mongoose");

const MerkleRootSchema = new mongoose.Schema({
  // Der eigentliche Merkle Root Hash
  root: {
    type: String,
    required: true,
    unique: true,
  },
  // Ein Name, um diesen Root zu identifizieren (z.B. "Phase 1 Allowlist")
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // Ein Zeitstempel, wann dieser Root erstellt wurde
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MerkleRoot", MerkleRootSchema);
