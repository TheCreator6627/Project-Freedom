"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Definiert, wie die Daten aussehen, die wir speichern
interface AuthState {
  token: string | null;
  user: {
    id: string;
    walletAddress: string;
    isAdmin: boolean;
  } | null;
  isLoading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

// Erstellt den Context, auf den die App zugreifen kann
const AuthContext = createContext<AuthState | undefined>(undefined);

// Erstellt den Provider, der die ganze Logik enthält
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Wichtig, um Ladezustände zu managen

  // Dieser Hook läuft einmal, wenn die App startet
  useEffect(() => {
    const loadUserFromToken = async () => {
      // 1. Suche nach einem gespeicherten Token im Browser
      const storedToken = localStorage.getItem('authToken');
      
      console.log("Beim Laden der Seite gefundenes Token:", storedToken);

      // 2. Wenn ein Token da ist, frage das Backend, wer dazu gehört
      if (storedToken) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          // 3. Wenn das Backend den Token bestätigt, stelle den Login-Status wieder her
          if (response.ok) {
            const userData = await response.json();
            setToken(storedToken);
            setUser(userData);
          } else {
            // Wenn der Token ungültig ist, lösche ihn
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error("Fehler beim Wiederherstellen der Session", error);
          localStorage.removeItem('authToken');
        }
      }
      // 4. Signalisiere, dass der Ladevorgang abgeschlossen ist
      setIsLoading(false);
    };

    loadUserFromToken();
  }, []);

  // Funktion zum Einloggen
  const login = (newToken: string, userData: any) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('authToken', newToken);
  };

  // Funktion zum Ausloggen
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {/* Zeige die App erst an, wenn der Lade-Check abgeschlossen ist */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// Ein einfacher Hook, um aus anderen Komponenten auf den Context zuzugreifen
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminSessionProvider');
  }
  return context;
}