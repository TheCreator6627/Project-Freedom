const express = require("express");
const connectDB = require("./db/mongo");

// Lade Umgebungsvariablen aus der .env-Datei
require("dotenv").config();

// --- ZUR DATENBANK VERBINDEN ---
// Diese Funktion wird aus ./db/mongo.js importiert und einmalig ausgeführt.
connectDB();

// Erstelle die Express-Anwendung
const app = express();

// --- MIDDLEWARE ---
// Aktiviere die Middleware, damit dein Server JSON-Anfragen lesen kann.
// Dies muss vor den Routen-Definitionen stehen.
app.use(express.json());

// --- ROUTEN ---
// Leite alle Anfragen, die mit '/api/auth' beginnen, an die auth.js-Datei weiter.
app.use("/api/auth", require("./routes/auth"));

// --- PORT DEFINITION ---
// Hole den Port aus den Umgebungsvariablen (für Hosting-Dienste wie Hetzner)
// oder benutze 5000 als Standard für die lokale Entwicklung.
const PORT = process.env.PORT || 5000;

// --- SERVER STARTEN ---
// Starte den Server und lausche auf dem definierten Port.
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
