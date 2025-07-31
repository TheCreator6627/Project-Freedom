const mongoose = require("mongoose");

// Das ist der "Bauplan" für unsere Benutzer
const UserSchema = new mongoose.Schema({
  // Ein Feld für die Wallet-Adresse des Benutzers
  walletAddress: {
    type: String,
    required: [true, "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"], // Feld ist ein Muss
    unique: true, // Jede Wallet-Adresse darf nur einmal vorkommen
    trim: true, // Entfernt Leerzeichen am Anfang und Ende
    lowercase: true, // Speichert die Adresse in Kleinbuchstaben
  },
  // Ein optionales Feld für einen Benutzernamen
  username: {
    type: String,
    unique: true,
    sparse: true, // Erlaubt mehrere leere Felder, aber wenn ein Wert da ist, muss er einzigartig sein
  },
  // Ein Zeitstempel, der automatisch beim Erstellen gesetzt wird
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Erstelle das "Werkzeug" (Model) basierend auf dem Bauplan und exportiere es
module.exports = mongoose.model("User", UserSchema);
