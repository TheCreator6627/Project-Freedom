// frontend/components/Dashboard.tsx
"use client";

import { useAccount, useBalance, useReadContract } from "wagmi";
import { fTokenAddress, fTokenAbi } from "@/src/lib/web3/contracts";
import { formatUnits } from "viem";

export function Dashboard() {
  const { address, isConnected } = useAccount();

  // Lese die F-Token-Balance des Nutzers
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: address,
    token: fTokenAddress,
  });

  // Lese den Gesamt-Supply
  const { data: totalSupplyData, isLoading: isSupplyLoading } = useReadContract({
    address: fTokenAddress,
    abi: fTokenAbi,
    functionName: 'totalSupply',
  });

  // Lese das maximale Halte-Limit
  const { data: maxHoldingData, isLoading: isHoldingLoading } = useReadContract({
    address: fTokenAddress,
    abi: fTokenAbi,
    functionName: 'maxWalletHolding',
  });
  
  // Zeige nichts, wenn nicht verbunden
  if (!isConnected) {
    return null;
  }

  // Hilfsfunktion zum Formatieren großer Zahlen
  const formatBigInt = (value: bigint | undefined, decimals: number = 18) => {
    if (value === undefined) return '...';
    return Number(formatUnits(value, decimals)).toLocaleString('de-DE');
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Balance Card */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-400">Dein F-Token Guthaben</h3>
        <p className="mt-2 text-3xl font-bold text-white">
          {isBalanceLoading ? 'Lädt...' : `${balanceData?.formatted.slice(0, 8)} F`}
        </p>
      </div>

      {/* Total Supply Card */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-400">Gesamt-Supply</h3>
        <p className="mt-2 text-3xl font-bold text-white">
          {isSupplyLoading ? 'Lädt...' : `${formatBigInt(totalSupplyData)} F`}
        </p>
      </div>

      {/* Max Holding Card */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-400">Max. Wallet Holding</h3>
        <p className="mt-2 text-3xl font-bold text-white">
           {isHoldingLoading ? 'Lädt...' : `${formatBigInt(maxHoldingData)} F`}
        </p>
      </div>
    </div>
  );
}