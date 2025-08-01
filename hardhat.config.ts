require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // dotenv für sichere Schlüsselverwaltung

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // Deine Solidity-Version
  networks: {
    // Dies ist dein lokales Netzwerk
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // Füge dieses Netzwerk hinzu
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY], // Lädt den Key sicher aus einer .env-Datei
    },
  },
};
