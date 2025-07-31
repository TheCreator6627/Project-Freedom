// frontend/app/page.tsx
// frontend/app/page.tsx
"use client"; // Diese Seite muss jetzt eine Client-Komponente sein

import { ConnectButton } from "../components/ConnectButton";
import { useEffect, useState } from "react"; // <-- Importieren

export default function Home() {
  // Ein State, um zu wissen, ob die Seite im Browser geladen ist
  const [isClient, setIsClient] = useState(false);

  // Dieser Effekt läuft nur einmal im Browser, nachdem die Seite geladen wurde
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Willkommen zu deinem FreedomProject</h1>
      <p>Bitte verbinde dein Wallet, um zu starten.</p>
      
      <div style={{ marginTop: '1rem' }}>
        {/* Zeige den Button erst an, wenn wir sicher im Browser sind */}
        {isClient && <ConnectButton />}
      </div>
    </main>
  );
}