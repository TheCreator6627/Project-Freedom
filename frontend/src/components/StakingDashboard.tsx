"use client";

import { useAccount, useReadContracts } from "wagmi";
import { stakingAddress, stakingAbi } from "@/lib/web3/contracts";
import { formatUnits } from "viem";
import { useMemo } from "react";

// Typen für Contract-Aufrufe
type StakersRaw = readonly [amount: bigint, stakedOn: bigint, unlocksOn: bigint];
type RewardRaw = bigint;

function StakingStat({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-2xl font-semibold text-white mt-1">
        {isLoading ? "..." : value}
      </p>
    </div>
  );
}

export function StakingDashboard() {
  const { address, isConnected } = useAccount();

  const { data, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: stakingAddress,
        abi: stakingAbi,
        functionName: "stakers",
        args: [address!],
      },
      {
        address: stakingAddress,
        abi: stakingAbi,
        functionName: "calculateReward",
        args: [address!],
      },
    ],
    query: {
      enabled: isConnected && !!address,
    },
  });

  const formattedValues = useMemo(() => {
    if (isLoading || !data) {
      return {
        stakedAmount: "0",
        reward: "0",
        unlockDate: "N/A",
      };
    }

    // ✅ Typen hier korrekt auslesen, ohne `as`
    const [stakerCall, rewardCall] = data as [
      { result: StakersRaw },
      { result: RewardRaw }
    ];

    const [amount, , unlocksOn] = stakerCall.result;
    const reward = rewardCall.result;

    if (amount === 0n) {
      return {
        stakedAmount: "0",
        reward: "0",
        unlockDate: "Nicht gestaked",
      };
    }

    const stakedAmountFmt = Number(formatUnits(amount, 18)).toLocaleString("de-DE", {
      maximumFractionDigits: 4,
    });

    const rewardFmt = Number(formatUnits(reward, 18)).toLocaleString("de-DE", {
      maximumFractionDigits: 4,
    });

    const unlockDateFmt =
      new Date(Number(unlocksOn) * 1000).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " Uhr";

    return {
      stakedAmount: stakedAmountFmt,
      reward: rewardFmt,
      unlockDate: unlockDateFmt,
    };
  }, [data, isLoading]);

  if (!isConnected) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-8 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Dein Staking-Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
        <StakingStat
          title="Gestakte F-Token"
          isLoading={isLoading}
          value={formattedValues.stakedAmount}
        />
        <StakingStat
          title="Deine Belohnung"
          isLoading={isLoading}
          value={formattedValues.reward}
        />
        <StakingStat
          title="Wird freigeschaltet am"
          isLoading={isLoading}
          value={formattedValues.unlockDate}
        />
      </div>
    </div>
  );
}
