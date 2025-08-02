"use client";

import { ClaimReward } from '@/components/ClaimReward'; // KORRIGIERT
import { ConnectButton } from '@/components/ConnectButton'; // KORRIGIERT
import { useAccount } from 'wagmi';

export default function ClaimPage() {
    const { isConnected } = useAccount();

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">Belohnungen abholen</h1>
            {isConnected ? (
                <ClaimReward />
            ) : (
                <div>
                    <p className="mb-4">Bitte verbinde deine Wallet, um deine Belohnungen zu sehen.</p>
                    <ConnectButton />
                </div>
            )}
        </main>
    );
}