const pino = require("pino");

// Konfiguration für den Logger
const logger = pino({
  transport: {
    target: "pino-pretty", // Macht die Ausgabe im Terminal hübsch
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

module.exports = logger;
