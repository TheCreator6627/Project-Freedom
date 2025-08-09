const express = require("express");
const path = require("path"); // Node.js-Modul für die Pfad-Verarbeitung
const cors = require("cors");
const logger = require("./utils/logger");
const connectDB = require("./db/mongo");

// Lade die Umgebungsvariablen aus dem Hauptverzeichnis (eine Ebene höher).
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Jobs und Worker initialisieren
require("./jobs/worker"); // Startet den Worker, damit er auf Jobs lauscht
require("./jobs/snapshotJob").start(); // Startet den geplanten Cron-Job

// Mit der Datenbank verbinden
connectDB();

const app = express();

// --- Middleware ---
app.use(cors()); // Erlaubt Anfragen vom Frontend
app.use(express.json()); // Erlaubt das Lesen von JSON-Bodies

// --- Routen ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/allowlist", require("./routes/allowlist"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`🚀 Server läuft auf Port ${PORT}`));
