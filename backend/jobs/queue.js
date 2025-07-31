const { Queue } = require("bullmq");

// Stelle sicher, dass die Redis-URL vorhanden ist
if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in the .env file");
}

// Erstelle die Verbindung zu Redis.
// BullMQ benötigt die URL in einem Objekt
const connection = {
  host: new URL(process.env.REDIS_URL).hostname,
  port: new URL(process.env.REDIS_URL).port,
  username: new URL(process.env.REDIS_URL).username,
  password: new URL(process.env.REDIS_URL).password,
};

// Erstelle und exportiere eine Queue namens 'snapshot'
const snapshotQueue = new Queue("snapshot", { connection });

module.exports = {
  snapshotQueue,
};
