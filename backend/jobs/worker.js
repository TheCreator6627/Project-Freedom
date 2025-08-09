const { Worker } = require("bullmq");
const path = require("path");
const logger = require("../utils/logger");

// Importiere die Verbindungsinformationen aus der zentralen queue.js Datei
const { connection } = require("./queue");

// Definiere die Logik, die für jeden Job ausgeführt wird
const processorFile = path.join(
  __dirname,
  "processors",
  "snapshotProcessor.js"
);

// Übergebe die importierte 'connection' an den Worker
const worker = new Worker("snapshot", processorFile, { connection });

worker.on("completed", (job, result) => {
  logger.info(
    { job: job.id, result },
    `Job ${job.id} erfolgreich abgeschlossen.`
  );
});

worker.on("failed", (job, err) => {
  logger.error(
    { job: { id: job.id, data: job.data }, error: err.message },
    `Job ${job.id} ist fehlgeschlagen.`
  );
});

logger.info("Snapshot-Worker wurde gestartet und lauscht auf Jobs.");

module.exports = worker;
