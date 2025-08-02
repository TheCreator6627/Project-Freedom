"use client";
import { useAccount, useReadContract } from "wagmi";
import { stakingAddress, stakingAbi } from "@/src/lib/web3/contracts";
import { formatUnits } from "viem";
import { useEffect, useState } from "react";

export function StakingDashboard() {
  const { address } = useAccount();
  const [unlockDate, setUnlockDate] = useState<string>("");

  // Lese die Staking-Infos des Nutzers
  const { data: stakerInfo, isLoading: isStakerInfoLoading } = useReadContract({
    address: stakingAddress,
    abi: stakingAbi,
    functionName: 'stakers',
    args: [address!],
    query: { enabled: !!address }
  });

  // Berechne die Belohnung des Nutzers
  const { data: reward, isLoading: isRewardLoading } = useReadContract({
    address: stakingAddress,
    abi: stakingAbi,
    functionName: 'calculateReward',
    args: [address!],
    query: { enabled: !!address }
  });
  
  // Konvertiere den "unlocksOn" Timestamp in ein lesbares Datum
  useEffect(() => {
    if (stakerInfo && stakerInfo[2] > 0) {
      const date = new Date(Number(stakerInfo[2]) * 1000);
      setUnlockDate(date.toLocaleString('de-DE'));
    } else {
      setUnlockDate("");
    }
  }, [stakerInfo]);

  const formatBigInt = (value: bigint | undefined) => {
    if (value === undefined) return '...';
    return Number(formatUnits(value, 18)).toLocaleString('de-DE');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Dein Staking-Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-gray-400">Gestakte F-Token</h3>
          <p className="text-2xl font-semibold text-white">
            {isStakerInfoLoading ? 'Lädt...' : formatBigInt(stakerInfo?.[0])}
          </p>
        </div>
        <div>
          <h3 className="text-gray-400">Deine Belohnung</h3>
          <p className="text-2xl font-semibold text-white">
            {isRewardLoading ? 'Lädt...' : formatBigInt(reward)}
          </p>
        </div>
        <div>
          <h3 className="text-gray-400">Wird freigeschaltet am</h3>
          <p className="text-2xl font-semibold text-white">
            {isStakerInfoLoading ? 'Lädt...' : (unlockDate || 'Nicht gestaked')}
          </p>
        </div>
      </div>
    </div>
  );
}