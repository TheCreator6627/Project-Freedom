// frontend/context/AdminSession.tsx

"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// Definiere, wie die Benutzer- und Token-Daten aussehen
interface AuthState {
  token: string | null;
  user: {
    id: string;
    walletAddress: string;
    isAdmin: boolean;
  } | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

// Erstelle den Context mit einem Standardwert
const AuthContext = createContext<AuthState | undefined>(undefined);

// Erstelle den Provider, der die Logik enthält
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = (newToken: string, userData: any) => {
    setToken(newToken);
    setUser(userData);
    // Optional: Token im LocalStorage speichern, um den Login zu überdauern
    localStorage.setItem('authToken', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Erstelle einen einfachen Hook, um auf den Speicher zuzugreifen
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminSessionProvider');
  }
  return context;
}