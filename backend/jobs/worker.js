const { Worker } = require("bullmq");
const path = require("path");
const logger = require("../utils/logger");
const MerkleRoot = require("../models/merkleRoot");
const { generateMerkleTree } = require("../merkle/generator");

// Wir holen uns die Redis-Verbindungsinformationen aus der queue.js Datei
const { connection } = require("./queue");

// Definiere die Logik, die für jeden Job ausgeführt wird
const processorFile = path.join(
  __dirname,
  "processors",
  "snapshotProcessor.js"
);

const worker = new Worker("snapshot", processorFile, { connection });

worker.on("completed", (job, result) => {
  logger.info(
    { job: job.id, result },
    `Job ${job.id} erfolgreich abgeschlossen.`
  );
});

worker.on("failed", (job, err) => {
  logger.error(
    { job: job.id, error: err.message },
    `Job ${job.id} ist fehlgeschlagen.`
  );
});

logger.info("Snapshot-Worker wurde gestartet und lauscht auf Jobs.");

module.exports = worker;
