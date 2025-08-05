// frontend/components/ProtectedAdminRoute.tsx
"use client";

import { useAuth } from "@/src/context/AdminSession";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth(); // useAuth wird aus dem Context geladen
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Zeige einen Ladezustand, solange die Authentifizierung geprüft wird
  if (isLoading || !isClient) {
    return <div>Lade...</div>; // Verbesserter visueller Hinweis
  }

  // Wenn der Benutzer ein Admin ist, rendern wir die Kinderkomponenten
  if (user && user.isAdmin) {
    return <>{children}</>;
  }

  // Andernfalls leiten wir den Benutzer zur Anmeldeseite weiter
  // Das `useEffect` stellt sicher, dass dies nur clientseitig passiert
  useEffect(() => {
    if (isClient && !isLoading && (!user || !user.isAdmin)) {
      router.push('/login'); // Annahme, dass es eine Login-Seite gibt
    }
  }, [user, isLoading, isClient, router]);

  // Lade-Fallback für den Fall, dass eine Weiterleitung unmittelbar bevorsteht
  return <div>Zugriff verweigert. Weiterleitung...</div>;
}