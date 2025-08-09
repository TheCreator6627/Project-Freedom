const { Queue } = require("bullmq");
const logger = require("../utils/logger");

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  logger.error("FATAL: REDIS_URL ist in der .env-Datei nicht definiert.");
  throw new Error("REDIS_URL is not defined");
}

if (!redisUrl.startsWith("redis://") && !redisUrl.startsWith("rediss://")) {
  logger.error({ redisUrl }, "FATAL: Die REDIS_URL ist ungültig.");
  throw new TypeError("Invalid Redis URL format.");
}

let connection;
try {
  const url = new URL(redisUrl);
  connection = {
    host: url.hostname,
    port: Number(url.port),
    username: url.username,
    password: url.password,
    tls: url.protocol === "rediss:" ? {} : undefined,
  };
} catch (error) {
  logger.error({ error, redisUrl }, "FATAL: Fehler beim Parsen der REDIS_URL.");
  throw error;
}

logger.info(
  { host: connection.host, port: connection.port },
  "Verbindung zur Redis-Queue wird hergestellt..."
);

const snapshotQueue = new Queue("snapshot", { connection });

// WICHTIGE ÄNDERUNG: Wir exportieren jetzt die Verbindung und die Queue
module.exports = {
  connection,
  snapshotQueue,
};
