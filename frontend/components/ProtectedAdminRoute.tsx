// frontend/components/ProtectedAdminRoute.tsx

"use client";

import { useAuth } from "@/context/AdminSession";
import { useEffect, useState } from "react";

// Diese Komponente "umhüllt" eine Seite und zeigt sie nur an, wenn ein Admin eingeloggt ist.
export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Zeige nichts, solange die Seite nicht vollständig im Browser geladen ist
  if (!isClient) {
    return null;
  }

  // Wenn ein Token da ist, zeige den Inhalt der Seite an
  if (token) {
    return <>{children}</>;
  }

  // Wenn kein Token da ist, zeige eine "Zugriff verweigert"-Nachricht
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Zugriff verweigert</h1>
      <p>Bitte mit einem Admin-Wallet verbinden, um diese Seite zu sehen.</p>
    </div>
  );
}