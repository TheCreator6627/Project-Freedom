// frontend/components/ProtectedAdminRoute.tsx
"use client";

import { useAuth } from "@/context/AdminSession"; // KORRIGIERTER IMPORT
import { useEffect, useState } from "react";
import React from 'react';

// NUR DIESE EINE DEFINITION BEHALTEN
export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth(); // isLoading hinzugefügt für besseres Handling
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Zeige nichts, solange der Lade-Check (aus AdminSession) oder die Client-Side-Prüfung läuft
  if (isLoading || !isClient) {
    return null; // oder ein Lade-Spinner
  }

  // Wenn der Lade-Check fertig ist und ein Token da ist, zeige den Inhalt an
  if (token) {
    return <>{children}</>;
  }

  // Wenn kein Token da ist, zeige die "Zugriff verweigert"-Nachricht
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Zugriff verweigert</h1>
      <p>Bitte mit einem Admin-Wallet verbinden, um diese Seite zu sehen.</p>
    </div>
  );
}