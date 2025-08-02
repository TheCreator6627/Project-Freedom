"use client";

import { useWriteContract } from 'wagmi';
import { stakingAddress, stakingAbi } from '@/lib/contracts'; // KORRIGIERT
import { parseEther } from 'viem';

export function StakingActions() {
  const { writeContract, isPending } = useWriteContract();

  const handleStake = () => {
    if (!stakingAddress) {
      console.error("Staking Adresse nicht gefunden!");
      return;
    }
    writeContract({
      address: stakingAddress,
      abi: stakingAbi,
      functionName: 'stake',
      args: [parseEther('100')], 
    });
  };

  return (
    <button
      onClick={handleStake}
      disabled={isPending || !stakingAddress}
      className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500"
    >
      {isPending ? 'Wird verarbeitet...' : '100 Token staken'}
    </button>
  );
}