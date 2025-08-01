const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config(); // Lädt die .env-Datei

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    bscTestnet: {
      provider: () =>
        new HDWalletProvider(
          [process.env.PRIVATE_KEY],
          `https://data-seed-prebsc-1-s1.binance.org:8545`
        ),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.20", // Sicherstellen, dass dies deine Solidity-Version ist
    },
  },
};
