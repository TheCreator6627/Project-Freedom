// "use client" ist wichtig für die Verwendung von Hooks
"use client";

import { useAccount } from "wagmi";
import Link from 'next/link';

// Komponenten importieren
import { ConnectButton } from "../components/ConnectButton";
import { Dashboard } from "../components/Dashboard";
import { WelcomeSplash } from "../components/WelcomeSplash";

export default function Home() {
  // Wir holen uns den 'status' für eine robustere Prüfung (connecting, connected, disconnected)
  const { status } = useAccount();

  // Funktion, um den Inhalt basierend auf dem Status zu rendern
  const renderContent = () => {
    // 1. Ladezustand
    if (status === 'connecting' || status === 'reconnecting') {
      return (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-400">Verbinde Wallet...</p>
        </div>
      );
    }
    
    // 2. Zustand "Verbunden"
    if (status === 'connected') {
      return (
        <>
          <Dashboard />
          <div className="mt-8 text-center">
            <Link href="/staking" className="text-xl text-blue-400 hover:underline font-semibold">
              Zum Staking-Portal {'->'}
            </Link>
          </div>
        </>
      );
    }
    
    // 3. Standardzustand "Nicht verbunden"
    return <WelcomeSplash />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold">
            FreedomProject
          </h1>
          <ConnectButton />
        </header>
        
        {/* Hier wird der Inhalt dynamisch gerendert */}
        <div>{renderContent()}</div>

      </main>
      
      <footer className="text-center p-4 text-gray-500 border-t border-gray-700">
        © {new Date().getFullYear()} FreedomProject. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
}