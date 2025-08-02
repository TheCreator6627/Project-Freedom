"use client";

import { StakingDashboard } from '@/components/StakingDashboard'; // KORRIGIERT
import { StakingActions } from '@/components/StakingActions'; 
import { useAccount } from 'wagmi';

export default function StakingPage() {
  const { isConnected } = useAccount();

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Staking Portal</h1>
      {isConnected ? (
        <div className="space-y-8">
          <StakingDashboard />
          <StakingActions />
        </div>
      ) : (
        <p>Bitte verbinde deine Wallet, um das Staking-Portal zu nutzen.</p>
      )}
    </main>
  );
}