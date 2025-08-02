// frontend/src/context/Web3Provider.tsx
"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { walletConnect } from 'wagmi/connectors';
import { injected } from 'wagmi/connectors';

// Lese die Project ID aus den Umgebungsvariablen. Der '!' am Ende sagt TypeScript, dass wir sicher sind, dass sie existiert.
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set in .env.local or on Vercel.");
}

// Erstelle die Konfiguration für wagmi
const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    injected(), // Für MetaMask und andere Browser-Wallets
    walletConnect({ projectId }), // Für mobile Wallets über QR-Code
  ],
  transports: {
    // Hier kannst du später deine Alchemy/Infura URL eintragen, um es stabiler zu machen
    [bscTestnet.id]: http(),
  },
});

// Erstelle einen Query-Client für das Caching von Daten
const queryClient = new QueryClient();

// Das ist die "Providers"-Komponente, die du in layout.tsx importierst
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}