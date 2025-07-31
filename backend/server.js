const express = require("express");

const connectDB = require("./db/mongo");

const cors = require("cors"); // <-- Importieren

require("dotenv").config();

connectDB();

const app = express();

// --- MIDDLEWARE ---

app.use(cors()); // <-- HIER verwenden, um Anfragen zu erlauben

app.use(express.json());

// --- ROUTEN ---

app.use("/api/auth", require("./routes/auth"));

app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
