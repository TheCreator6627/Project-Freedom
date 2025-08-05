// src/context/AdminSession.tsx
"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect 
} from 'react';

// === NEUE, PRÄZISE TYP-DEFINITION FÜR SICHERHEIT UND WARTBARKEIT ===
interface User {
  id: string;
  walletAddress: string;
  isAdmin: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void; // Statt `any`
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // Statt `any`
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      // HTTP-Only-Cookie wird serverseitig verwaltet.
      // Hier keine clientseitige Logik zum Laden des Tokens.
      
      try {
        // URL dynamisch aus Umgebungsvariable laden
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiBaseUrl}/api/auth/me`); // Cookie wird automatisch gesendet

        if (response.ok) {
          const userData: User = await response.json();
          // Token wird nicht im Frontend verwaltet, da es im Cookie liegt
          setUser(userData);
        }
      } catch (error) {
        console.error("Fehler beim Wiederherstellen der Session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  // Login und Logout interagieren jetzt mit dem Server, nicht direkt mit localStorage
  const login = (newToken: string, userData: User) => {
    // Die Logik zum Setzen des Cookies sollte im Backend liegen
    // oder ein API-Aufruf, der das Cookie serverseitig setzt.
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    // API-Aufruf zum Löschen des Cookies im Backend
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    await fetch(`${apiBaseUrl}/api/auth/logout`);
    setToken(null);
    setUser(null);
  };

  const value = { token, user, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminSessionProvider');
  }
  return context;
}