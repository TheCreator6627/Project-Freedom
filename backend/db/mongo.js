const mongoose = require("mongoose");

// Wir laden die .env-Datei aus dem Hauptverzeichnis des Backends
require("dotenv").config({
  path: "C:UsersHPDesktopFreedomProject\backend.env",
});

// Eine Funktion, um die Verbindung zur Datenbank aufzubauen
const connectDB = async () => {
  try {
    // Hole die Verbindungs-URI aus der .env-Datei
    const mongoURI = process.env.MONGO_URI;

    // Prüfe, ob die URI überhaupt da ist
    if (!mongoURI) {
      throw new Error("MONGO_URI ist nicht in der .env-Datei definiert!");
    }

    // Baue die Verbindung auf und warte, bis sie steht
    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB erfolgreich verbunden...");
  } catch (err) {
    // Fange alle Fehler ab, gib sie in der Konsole aus und beende den Server
    console.error("❌ MongoDB Verbindungsfehler:", err.message);
    process.exit(1); // Beendet den Prozess mit einem Fehlercode
  }
};

// Exportiere die Funktion, damit wir sie in anderen Dateien verwenden können
module.exports = connectDB;
