// frontend/components/ConnectButton.tsx

"use client";

import { useAuth } from "@/context/AdminSession"; // <-- Importiere den Auth-Hook
import { useEffect, useState, useCallback } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { login, logout, token } = useAuth(); // <-- Hole login, logout und token aus dem Speicher
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const handleLogin = useCallback(async (walletAddress: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
      if (!response.ok) throw new Error("Login-Anfrage fehlgeschlagen");
      
      const data = await response.json();
      if (data.token) {
        // HIER: Speichere das Token im globalen Speicher
        login(data.token, data.user);
        console.log("Admin erfolgreich eingeloggt und Token gespeichert.");
      }
    } catch (error) {
      console.error("Fehler beim Login:", error);
    }
  }, [login]);

  useEffect(() => {
    if (isConnected && address && !hasLoggedIn) {
      handleLogin(address);
      setHasLoggedIn(true);
    }
    if (!isConnected) {
      setHasLoggedIn(false);
    }
  }, [isConnected, address, hasLoggedIn, handleLogin]);

  const handleDisconnect = () => {
    wagmiDisconnect();
    logout(); // <-- Beim Trennen auch aus dem Admin-Speicher ausloggen
  };

  // Wenn ein Token da ist, bist du als Admin eingeloggt
  if (token) {
    return (
      <div>
        <p>Admin verbunden: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        <button onClick={handleDisconnect}>Verbindung trennen</button>
      </div>
    );
  }

  // Wenn nur das Wallet verbunden ist, aber du kein Admin bist
  if (isConnected) {
    return (
      <div>
        <p>Verbunden: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        <button onClick={handleDisconnect}>Verbindung trennen</button>
      </div>
    );
  }

  // Wenn gar nichts verbunden ist
  return (
    <button onClick={() => connect({ connector: injected() })}>
      Wallet verbinden
    </button>
  );
}