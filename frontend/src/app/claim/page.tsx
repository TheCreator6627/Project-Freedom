"use client";
import { ClaimReward } from "@/src/components/ClaimReward";
import { ConnectButton } from "@/src/components/ConnectButton";
import Link from 'next/link';

export default function ClaimPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <Link href="/" className="text-blue-400 hover:underline">{'<'} Zurück zum Haupt-Dashboard</Link>
          <h1 className="text-2xl md:text-4xl font-bold text-white mt-2">NFT Belohnungen</h1>
        </div>
        <ConnectButton />
      </header>
      <ClaimReward />
    </main>
  );
}