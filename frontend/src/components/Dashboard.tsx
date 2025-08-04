"use client";

import { useAccount, useBalance, useReadContracts } from "wagmi";
import { fTokenAddress, fTokenAbi } from "@/lib/web3/contracts";
import { formatUnits, Abi } from "viem";
import { ReactNode } from "react";

// HELPER: Eine wiederverwendbare Card-Komponente für ein sauberes Layout
function DashboardCard({ title, data, isLoading, unit }: { title: string, data: string, isLoading: boolean, unit?: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium text-gray-400">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-white">
        {isLoading ? 'Lädt...' : `${data} ${unit || ''}`}
      </p>
    </div>
  );
}

// HELPER: Eine Hilfsfunktion zum sicheren Formatieren von BigInt-Werten
const formatBigInt = (value: unknown, decimals: number = 18): string => {
  if (typeof value === 'bigint') {
    return Number(formatUnits(value, decimals)).toLocaleString('de-DE');
  }
  return 'N/A'; // Sicherer Fallback, falls die Daten nicht vom Typ bigint sind
};

// Hauptkomponente
export function Dashboard() {
  const { address, isConnected } = useAccount();

  // Abruf der F-Token-Balance (bleibt separat, da es ein dedizierter Hook ist)
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: address,
    token: fTokenAddress,
    query: { enabled: isConnected } // Abfrage nur starten, wenn verbunden
  });

  // Bündelt mehrere Lese-Anfragen in einen einzigen, effizienten Aufruf (Multicall)
  const { data, isLoading: isContractDataLoading } = useReadContracts({
    contracts: [
      {
        address: fTokenAddress,
        abi: fTokenAbi,
        functionName: 'totalSupply',
      },
      {
        address: fTokenAddress,
        abi: fTokenAbi,
        functionName: 'maxWalletHolding',
      }
    ],
    query: { enabled: isConnected } // Abfrage nur starten, wenn verbunden
  });

  // Sicherer Zugriff auf die gebündelten Daten
  const totalSupplyResult = data?.[0]?.result;
  const maxHoldingResult = data?.[1]?.result;

  if (!isConnected) {
    return (
      <div className="text-center mt-8 p-6 bg-gray-800 rounded-lg">
        <p className="text-gray-400">Bitte verbinden Sie Ihre Wallet, um das Dashboard anzuzeigen.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard
        title="Dein F-Token Guthaben"
        isLoading={isBalanceLoading}
        data={balanceData ? parseFloat(balanceData.formatted).toLocaleString('de-DE', { maximumFractionDigits: 4 }) : '0'}
        unit="F"
      />
      <DashboardCard
        title="Gesamt-Supply"
        isLoading={isContractDataLoading}
        data={formatBigInt(totalSupplyResult)}
        unit="F"
      />
      <DashboardCard
        title="Max. Wallet Holding"
        isLoading={isContractDataLoading}
        data={formatBigInt(maxHoldingResult)}
        unit="F"
      />
    </div>
  );
}