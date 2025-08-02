// frontend/components/StakingActions.tsx
"use client";

import { useWriteContract } from 'wagmi';
import { STAKING_ABI } from '@/lib/abi'; // <-- KORREKTER IMPORT
import { parseEther } from 'viem';

// Die Adresse deines Staking-Vertrags
const STAKING_CONTRACT_ADDRESS = '0xDEINE_STAKING_VERTRAGSADRESSE';

export function StakingActions() {
  const { writeContract, isPending } = useWriteContract();

  const handleStake = () => {
    writeContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [parseEther('100')], // Beispiel: 100 Token staken
    });
  };

  return (
    <div className="p-4 border border-gray-700 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Aktionen</h3>
      <button
        onClick={handleStake}
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500"
      >
        {isPending ? 'Stake wird verarbeitet...' : '100 Token staken'}
      </button>
    </div>
  );
}