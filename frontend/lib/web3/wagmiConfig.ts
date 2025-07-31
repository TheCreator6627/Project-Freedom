// lib/web3/wagmiConfig.ts

import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Hole den Alchemy API Key aus den Umgebungsvariablen
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

if (!alchemyApiKey) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is not set in .env.local");
}

export const config = createConfig({
  chains: [mainnet, sepolia], // Definiere die Blockchains, die deine App unterstützt
  connectors: [
    injected(), // Unterstützt Browser-Wallets wie MetaMask
  ],
  transports: {
    // Sag wagmi, wie es mit den Blockchains kommunizieren soll
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  },
});
