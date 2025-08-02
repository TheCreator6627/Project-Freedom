"use client";

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Abi } from 'viem';

interface AdminActionProps {
  contractAddress: `0x${string}`;
  contractAbi: Abi;
  functionName: string;
  args?: any[];
  buttonText: string;
  successMessage: string;
}

export function AdminAction({ contractAddress, contractAbi, functionName, args = [], buttonText, successMessage }: AdminActionProps) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleAction = () => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: functionName,
      args: args,
    });
  };

  return (
    <div className="border-t border-gray-700 pt-4 mt-4">
      <button onClick={handleAction} disabled={isPending || isConfirming} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm">
        {isPending ? 'Bestätigen...' : isConfirming ? 'In Arbeit...' : buttonText}
      </button>
      {isConfirmed && <p className="text-green-400 mt-2">{successMessage}</p>}
      {error && <p className="text-red-400 mt-2">Fehler: {error.shortMessage}</p>}
    </div>
  );
}