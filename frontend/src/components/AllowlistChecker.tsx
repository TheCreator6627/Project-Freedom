"use client";

import { useAccount } from "wagmi";
import { useState } from "react";

export function AllowlistChecker() {
  const { address, isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!address) {
      setMessage("Bitte zuerst Wallet verbinden.");
      return;
    }
    setIsLoading(true);
    setMessage("");

    try {
      // Name der Allowlist, die geprüft werden soll
      const listName = "Phase 1 Allowlist";
      
      // Baue die URL sicher zusammen
      const url = new URL('http://localhost:5000/api/allowlist/proof');
      url.searchParams.append('walletAddress', address);
      url.searchParams.append('listName', listName);
      
      const response = await fetch(url.toString());
      const data = await response.json();

      if (response.ok) {
        setMessage(`Glückwunsch! Du bist auf der Liste. Dein Proof ist: ${JSON.stringify(data.proof)}`);
      } else {
        setMessage(data.msg || "Ein Fehler ist aufgetreten.");
      }
    } catch (err) {
      setMessage("Kommunikationsfehler zum Server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return null; // Zeige nichts an, wenn kein Wallet verbunden ist
  }

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
      <h2>Prüfe deinen Allowlist-Status</h2>
      <button onClick={handleCheck} disabled={isLoading}>
        {isLoading ? "Prüfe..." : "Bin ich auf der 'Phase 1'-Liste?"}
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}