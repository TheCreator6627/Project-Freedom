const express = require("express");
const connectDB = require("./db/mongo");
const cors = require("cors");
const logger = require("./utils/logger"); // <-- Importieren

require("dotenv").config();
connectDB();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTEN ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/allowlist", require("./routes/allowlist"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`🚀 Server läuft auf Port ${PORT}`));
// ... (alle Imports von vorher)
const logger = require('./utils/logger');

// Jobs und Worker initialisieren
require('./jobs/worker'); // Startet den Worker, damit er auf Jobs lauscht
require('./jobs/snapshotJob').start(); // Startet den geplanten Cron-Job

// ... (Rest der server.js wie app.use(cors), etc.)

app.listen(PORT, () => logger.info(`🚀 Server läuft auf Port ${PORT}`));
