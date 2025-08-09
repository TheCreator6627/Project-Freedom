const pino = require("pino");

/**
 * Konfiguriert und exportiert einen zentralen, performanten Logger für die Anwendung.
 * Im Entwicklungsmodus wird die Ausgabe für bessere Lesbarkeit formatiert ("pretty print").
 * Im Produktionsmodus wird performantes, strukturiertes JSON-Logging verwendet.
 */
const logger = pino({
  // Im Entwicklungsmodus (NODE_ENV ist nicht 'production') wird pino-pretty verwendet.
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: "pid,hostname", // Reduziert das Rauschen in den Logs
          },
        }
      : undefined, // Im Produktionsmodus wird das Standard-JSON-Format verwendet.
});

module.exports = logger;
