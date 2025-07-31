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
