// --- IMPORTS ---
const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
require("dotenv").config();
const connectDB = require("./db/mongo");

// --- INITIALISIERUNG ---
connectDB();
const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTEN ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/allowlist", require("./routes/allowlist"));

// --- HINTERGRUND-JOBS (falls vorhanden) ---
// require('./jobs/worker');
// require('./jobs/snapshotJob').start();

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`🚀 Server läuft auf Port ${PORT}`));
