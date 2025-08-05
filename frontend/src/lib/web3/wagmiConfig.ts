// frontend/lib/web3/wagmiConfig.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bscTestnet } from "wagmi/chains"; // BNB Testnet 8585 // 

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

if (!alchemyApiKey) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is not set in .env.local");
}

export const config = getDefaultConfig({
  appName: "FreedomProject",
  projectId: "90c38645a37fc8ea440f134dbd307eae", // Erhalte eine ID von https://cloud.walletconnect.com/
  chains: [bscTestnet], // Wir konfigurieren es für das BNB Testnet
  // transports werden von getDefaultConfig automatisch mit deinem Alchemy Key konfiguriert
});
