"use client";
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { rewardManagerAddress, rewardManagerAbi } from '@/lib/web3/contracts';
import React from 'react';

interface ClaimButtonProps {
  tokenId: number;
  listName: string;
}

function ClaimButton({ tokenId, listName }: ClaimButtonProps) {
  const { address } = useAccount();
  const [message, setMessage] = useState('');

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleClaim = async () => {
    setMessage('');
    if (!address) {
      setMessage("Bitte Wallet verbinden.");
      return;
    }

    try {
      // 1. Proof vom Backend holen
      const url = new URL('http://localhost:5000/api/allowlist/proof');
      url.searchParams.append('walletAddress', address);
      url.searchParams.append('listName', listName);
      
      const proofResponse = await fetch(url.toString());
      const data = await proofResponse.json();

      if (!proofResponse.ok) {
        throw new Error(data.msg || 'Proof konnte nicht geholt werden.');
      }
      
      const merkleProof = data.proof;

      // 2. Transaktion an den Smart Contract senden
      writeContract({
        address: rewardManagerAddress,
        abi: rewardManagerAbi,
        functionName: 'claimNFT',
        args: [BigInt(tokenId), merkleProof],
      });

    } catch (err: any) {
      setMessage(`Fehler: ${err.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleClaim} disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
        {isPending ? 'Warte...' : `Claim NFT #${tokenId}`}
      </button>
      {isConfirming && <p className="text-yellow-400 mt-2">Transaktion wird verarbeitet...</p>}
      {isConfirmed && <p className="text-green-400 mt-2">NFT erfolgreich geclaimed!</p>}
      {error && <p className="text-red-400 mt-2">Fehler: {error.shortMessage}</p>}
      {message && !isPending && <p className="text-gray-400 mt-2">{message}</p>}
    </div>
  );
}


export function ClaimReward() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-400">Bitte verbinde dein Wallet, um deine Belohnungen zu sehen.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Deine NFT-Belohnungen</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Wir erstellen manuell 5 Claim-Buttons */}
        <ClaimButton tokenId={1} listName="Airdrop-Jahr-1-2025-08-01" />
        <ClaimButton tokenId={2} listName="Airdrop-Jahr-2" />
        <ClaimButton tokenId={3} listName="Airdrop-Jahr-3" />
        <ClaimButton tokenId={4} listName="Airdrop-Jahr-4" />
        <ClaimButton tokenId={5} listName="Airdrop-Jahr-5" />
      </div>
    </div>
  );
}