"use client";
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { stakingAddress, stakingAbi, fTokenAddress, fTokenAbiForApproval } from '@/lib/web3/contracts';
import { parseUnits } from 'viem';

export function StakingActions() {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(30);

  // Wagmi Hook für das Schreiben von Transaktionen
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  // Wagmi Hook, um auf die Bestätigung der Transaktion zu warten
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleStake = async () => {
    const parsedAmount = parseUnits(amount, 18);

    // WICHTIG: Zuerst muss der Staking-Vertrag die Erlaubnis bekommen, die Token auszugeben
    writeContract({
      address: fTokenAddress,
      abi: fTokenAbiForApproval,
      functionName: 'approve',
      args: [stakingAddress, parsedAmount],
    }, {
      onSuccess: () => {
        // Erst nach erfolgreichem "approve" rufen wir die eigentliche "stake"-Funktion auf
        writeContract({
          address: stakingAddress,
          abi: stakingAbi,
          functionName: 'stake',
          args: [parsedAmount, BigInt(duration)],
        });
      }
    });
  };

  const handleUnstake = () => {
    writeContract({
      address: stakingAddress,
      abi: stakingAbi,
      functionName: 'unstake',
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Aktionen</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Staking Form */}
        <div className="flex-1">
          <h3 className="text-white mb-2">Neuen Stake starten</h3>
          <input
            type="number"
            placeholder="Anzahl F-Token"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <select 
            value={duration} 
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          >
            <option value={30}>30 Tage</option>
            <option value={90}>90 Tage</option>
            <option value={180}>180 Tage</option>
            <option value={365}>365 Tage</option>
          </select>
          <button onClick={handleStake} disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {isPending ? 'Warte auf Bestätigung...' : 'Stake'}
          </button>
        </div>
        {/* Unstaking Button */}
        <div className="flex-1">
          <h3 className="text-white mb-2">Bestehenden Stake abheben</h3>
          <p className="text-gray-400 mb-4 text-sm">Dies ist nur möglich, wenn die Sperrfrist abgelaufen ist.</p>
          <button onClick={handleUnstake} disabled={isPending} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {isPending ? 'Warte auf Bestätigung...' : 'Unstake'}
          </button>
        </div>
      </div>
       {/* Status-Anzeigen für die Transaktion */}
      {isConfirming && <p className="text-yellow-400 mt-4">Transaktion wird verarbeitet...</p>}
      {isConfirmed && <p className="text-green-400 mt-4">Transaktion erfolgreich bestätigt!</p>}
      {error && <p className="text-red-400 mt-4">Fehler: {error.shortMessage}</p>}
    </div>
  );
}