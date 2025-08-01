const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const stream = require("stream");
const logger = require("../utils/logger");
const { protectAdmin } = require("../middleware/auth");
const { snapshotQueue } = require("../jobs/queue");
const MerkleRoot = require("../models/merkleRoot");

const upload = multer({ storage: multer.memoryStorage() });

// Schütze alle Routen in dieser Datei
router.use(protectAdmin);

// POST /api/admin/upload-allowlist
router.post("/upload-allowlist", upload.single("allowlistFile"), (req, res) => {
  const { name } = req.body;
  if (!req.file || !name) {
    return res.status(400).json({ msg: "Name und Datei sind erforderlich." });
  }

  const walletAddresses = [];
  const readableStream = new stream.Readable();
  readableStream._read = () => {};
  readableStream.push(req.file.buffer);
  readableStream.push(null);

  readableStream
    .pipe(csv({ headers: false }))
    .on("data", (row) => {
      walletAddresses.push(row[0].trim().toLowerCase());
    })
    .on("end", async () => {
      try {
        await snapshotQueue.add("generate-root-from-csv", {
          name,
          walletAddresses,
        });
        res
          .status(202)
          .json({
            msg: `Job akzeptiert. ${walletAddresses.length} Adressen werden im Hintergrund verarbeitet.`,
          });
      } catch (err) {
        logger.error(err, "Fehler beim Hinzufügen des Upload-Jobs zur Queue.");
        res.status(500).send("Server-Fehler");
      }
    });
});

// POST /api/admin/generate-merkle
router.post("/generate-merkle", async (req, res) => {
  const { name, walletAddresses } = req.body;
  if (!name || !walletAddresses || !Array.isArray(walletAddresses)) {
    return res
      .status(400)
      .json({ msg: "Name und Adressliste sind erforderlich." });
  }

  try {
    await snapshotQueue.add("generate-root-from-manual", {
      name,
      walletAddresses,
    });
    res
      .status(202)
      .json({
        msg: "Job akzeptiert. Die Liste wird im Hintergrund verarbeitet.",
      });
  } catch (err) {
    logger.error(err, "Fehler beim Hinzufügen des manuellen Jobs zur Queue.");
    res.status(500).send("Server-Fehler");
  }
});

// GET /api/admin/merkle-roots (Die wiederhergestellte Route)
router.get("/merkle-roots", async (req, res) => {
  try {
    const roots = await MerkleRoot.find().sort({ createdAt: -1 }); // Neueste zuerst
    res.json(roots);
  } catch (err) {
    logger.error(err, "Fehler beim Laden der Merkle Roots");
    res.status(500).send("Server-Fehler");
  }
});

module.exports = router;
