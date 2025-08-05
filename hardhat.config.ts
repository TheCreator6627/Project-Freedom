// hardhat.config.ts

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "your_private_key_here";
const BSCTESTNET_URL =
  process.env.BSCTESTNET_URL ||
  "https://data-seed-prebsc-1-s1.binance.org:8545";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Lokales Hardhat-Netzwerk für Entwicklung und Tests
    hardhat: {
      chainId: 31337,
    },
    // Konfiguration für das BSC Testnet
    bscTestnet: {
      url: BSCTESTNET_URL,
      accounts: [PRIVATE_KEY],
      chainId: 97,
    },
  },
  // Füge hier weitere Konfigurationen hinzu (z. B. für Etherscan Verification)
};

export default config;
