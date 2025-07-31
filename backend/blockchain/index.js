// Lade die Umgebungsvariablen.
// Wichtig: Wir geben den Pfad an, da die .env-Datei ein Verzeichnis höher liegt.
require("dotenv").config({ path: "../.env" });

const { Alchemy, Network } = require("alchemy-sdk");

// Prüfen, ob der API-Schlüssel geladen wurde
if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY ist nicht in der .env-Datei gesetzt!");
}

// Die Konfiguration für die Alchemy-Verbindung
const settings = {
  // Sicherer Zugriff auf den API-Schlüssel aus der .env-Datei
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA, // oder ein anderes Netzwerk
};

// Erstelle die Alchemy-Instanz
const alchemy = new Alchemy(settings);

// Testfunktion, um zu sehen, ob es klappt
async function checkConnection() {
  try {
    const latestBlock = await alchemy.core.getBlockNumber();
    console.log(
      "✅ Erfolgreich mit Alchemy verbunden! Letzter Block:",
      latestBlock
    );
  } catch (error) {
    console.error("❌ Fehler bei der Verbindung mit Alchemy:", error.message);
  }
}

checkConnection();

// Exportiere die alchemy-Instanz, damit du sie in anderen Teilen
// deiner Anwendung wiederverwenden kannst.
module.exports = alchemy;
