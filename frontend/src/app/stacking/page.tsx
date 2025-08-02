"use client";
import { StakingDashboard } from "@/components/StakingDashboard";
import { StakingActions } from "@/src/components/StakingActions";
import { ConnectButton } from "@/src/components/ConnectButton";
import { useAccount } from "wagmi";
import Link from 'next/link';

export default function StakingPage() {
  const { isConnected } = useAccount();

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <Link href="/" className="text-blue-400 hover:underline">{'<'} Zurück zum Haupt-Dashboard</Link>
          <h1 className="text-2xl md:text-4xl font-bold text-white mt-2">Staking</h1>
        </div>
        <ConnectButton />
      </header>

      {isConnected ? (
        <>
          <StakingDashboard />
          <StakingActions />
        </>
      ) : (
        <div className="text-center mt-20">
          <h2 className="text-3xl font-semibold text-white">Staking-Bereich</h2>
          <p className="text-gray-400 mt-2">Bitte verbinde dein Wallet, um zu staken.</p>
        </div>
      )}
    </main>
  );
}