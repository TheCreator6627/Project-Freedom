// backend/jobs/snapshotJob.js
const cron = require("node-cron");
const { Alchemy, Network } = require("alchemy-sdk");
const MerkleRoot = require("../models/MerkleRoot");
const { generateMerkleTree } = require("../merkle/generator");

// Konfiguration für Alchemy
const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA, // Wähle dein Netzwerk
};
const alchemy = new Alchemy(config);

/**
 * Dies ist eine komplexe Beispielfunktion.
 * Sie müsste an deinen spezifischen Token-Contract angepasst werden.
 */
const getLoyalHolders = async () => {
  console.log("Starte Snapshot: Suche nach treuen Token-Haltern...");

  // HIER IST DEINE ADRESSE EINGEFÜGT
  const tokenContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const requiredHoldingDays = 365;

  // HIER käme die komplexe Logik, um die Blockchain zu analysieren:
  // 1. Alle Transfer-Events für deinen Token-Vertrag holen.
  // 2. Für jede Adresse berechnen, wie lange sie den Token gehalten hat.
  // 3. Alle Adressen filtern, die die Bedingung (z.B. > 365 Tage) erfüllen.

  // FÜR UNSER BEISPIEL simulieren wir das Ergebnis:
  console.log("Blockchain-Analyse abgeschlossen. (Simuliert)");
  return [
    "0x311d4adb2004ccefdb9e39acff59c7b5e4949c2a",
    "0xAbCdEf1234567890aBcDeF1234567890aBcDeF12",
    "0x0987654321fedcba0987654321fedcba09876543",
  ];
};

const runSnapshot = async () => {
  try {
    const loyalHolders = await getLoyalHolders();

    if (loyalHolders.length === 0) {
      console.log(
        "Keine Adressen erfüllen die Kriterien. Kein neuer Merkle Root erstellt."
      );
      return;
    }

    const listName = `Airdrop-Jahr-1-${new Date().toISOString().split("T")[0]}`;
    const { root } = generateMerkleTree(loyalHolders);

    // Prüfen, ob es diese Liste schon gibt, um Duplikate zu vermeiden
    const existingRoot = await MerkleRoot.findOne({ name: listName });
    if (existingRoot) {
      console.log(`Merkle Root für "${listName}" existiert bereits.`);
      return;
    }

    // Den neuen Root in der DB speichern
    const newMerkleRoot = new MerkleRoot({
      name: listName,
      root: root,
      walletAddresses: loyalHolders,
    });
    await newMerkleRoot.save();
    console.log(
      `Erfolgreich! Neuer Merkle Root "${listName}" mit ${loyalHolders.length} Adressen gespeichert.`
    );
  } catch (error) {
    console.error("Fehler während des Snapshot-Jobs:", error);
  }
};

// Plane den Job so, dass er z.B. jeden Tag um 2 Uhr nachts läuft
// Syntax: Minute Stunde Tag-im-Monat Monat Wochentag
const scheduledJob = cron.schedule("0 2 * * *", runSnapshot, {
  scheduled: false, // Startet nicht sofort
});

// Exportiere eine Funktion, um den Job zu starten
const start = () => {
  console.log(
    "Snapshot-Job wurde initialisiert und wartet auf seinen Zeitplan."
  );
  scheduledJob.start();
  // Optional: runSnapshot(); // Einmal direkt beim Serverstart ausführen
};

module.exports = { start };
