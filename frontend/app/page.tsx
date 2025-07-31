"use client";

import { ConnectButton } from "../components/ConnectButton";
import { Dashboard } from "../components/Dashboard";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white">FreedomProject</h1>
        <ConnectButton />
      </header>
      
      {isConnected ? (
        <Dashboard />
      ) : (
        <div className="text-center mt-20">
          <h2 className="text-3xl font-semibold text-white">Willkommen</h2>
          <p className="text-gray-400 mt-2">Bitte verbinde dein Wallet, um das Dashboard zu sehen.</p>
        </div>
      )}
    </main>
  );
}