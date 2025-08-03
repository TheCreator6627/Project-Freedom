"use client";

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Abi, BaseError } from 'viem';

// Diese Hilfsfunktion extrahiert sicher die bestmögliche Fehlermeldung.
function getErrorMessage(error: Error | null): string {
  if (!error) return '';
  
  // Prüft, ob es sich um einen spezifischen Fehler von viem/wagmi handelt.
  if (error instanceof BaseError) {
    // Gibt die saubere, kurze Fehlermeldung zurück (z.B. "User denied transaction").
    return error.shortMessage;
  }
  
  // Fallback für alle anderen Standard-JavaScript-Fehler.
  return error.message;
}

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
      
      {/* KORREKTUR: Die Fehlermeldung wird jetzt über die Hilfsfunktion aufgerufen. */}
      {error && <p className="text-red-400 mt-2">Fehler: {getErrorMessage(error)}</p>}
    </div>
  );
}