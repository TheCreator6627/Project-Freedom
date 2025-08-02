// src/context/AdminSession.tsx
"use client";

// NUR EINMAL KORREKT IMPORTIEREN
import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect 
} from 'react';

// Definiert die Struktur der Authentifizierungsdaten
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

// NUR EINEN CONTEXT ERSTELLEN
const AuthContext = createContext<AuthState | undefined>(undefined);

// Provider, der die Logik und die Daten für die App bereitstellt
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const storedToken = localStorage.getItem('authToken');
      
      if (storedToken) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${storedToken}` },
          });

          if (response.ok) {
            const userData = await response.json();
            setToken(storedToken);
            setUser(userData);
          } else {
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error("Fehler beim Wiederherstellen der Session:", error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    loadUserFromToken();
  }, []);

  const login = (newToken: string, userData: any) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = { token, user, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {/* Die Kinder nicht rendern, solange der Ladevorgang aktiv ist */}
      {!isLoading ? children : null}
    </AuthContext.Provider>
  );
}

// Der Hook, um auf die Authentifizierungsdaten zuzugreifen
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminSessionProvider');
  }
  return context;
}