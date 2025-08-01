// Oben in der Datei die benötigten Pakete importieren
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config(); // Lädt die .env-Datei

module.exports = {
  networks: {
    // Dies ist dein lokales Testnetzwerk
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },

    // Angepasster Abschnitt für das BSC Testnet
    bscTestnet: {
      provider: () =>
        new HDWalletProvider(
          [process.env.PRIVATE_KEY], // <-- HIER IST DIE ÄNDERUNG
          `https://data-seed-prebsc-1-s1.binance.org:8545`
        ),
      network_id: 97, // Chain ID für BSC Testnet
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  // Rest deiner Konfiguration...
  compilers: {
    solc: {
      version: "0.8.20", // Deine Solidity-Version
    },
  },
};
