// --- IMPORTS ---
// Alle benötigten Pakete werden ganz oben importiert.
const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger"); // Nur eine Definition für den Logger
require("dotenv").config();

// --- INITIALISIERUNG ---
// Datenbankverbindung direkt am Anfang aufbauen.
const connectDB = require("./db/mongo");
connectDB();

// Express-App erstellen
const app = express();

// --- MIDDLEWARE ---
// Middleware wird registriert, bevor die Routen drankommen.
app.use(cors());
app.use(express.json());

// --- ROUTEN ---
// Die API-Routen der Anwendung werden hier eingebunden.
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/allowlist", require("./routes/allowlist"));

// --- HINTERGRUND-JOBS ---
// Jobs und Worker werden initialisiert, bevor der Server startet.
require("./jobs/worker"); // Startet den Worker, damit er auf Jobs lauscht
require("./jobs/snapshotJob").start(); // Startet den geplanten Cron-Job

// --- SERVER START ---
// Der Port wird aus der .env-Datei gelesen, mit 5000 als Fallback.
const PORT = process.env.PORT || 5000;

// Der Server wird an letzter Stelle gestartet, nur EINMAL.
app.listen(PORT, () => logger.info(`🚀 Server läuft auf Port ${PORT}`));
