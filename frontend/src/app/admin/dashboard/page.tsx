// frontend/app/admin/dashboard/page.tsx

"use client";

import { ProtectedAdminRoute } from "@/src/components/ProtectedAdminRoute";
import { useAuth } from "@/src/context/AdminSession";
import { useState, useEffect } from "react";

// Definiere, wie ein MerkleRoot-Objekt aussieht
interface MerkleRoot {
  _id: string;
  name: string;
  root: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [roots, setRoots] = useState<MerkleRoot[]>([]);
  const [newListName, setNewListName] = useState("");
  const [walletAddresses, setWalletAddresses] = useState("");
  const [message, setMessage] = useState("");

  // Funktion, um die Liste der Merkle Roots vom Backend zu laden
  const fetchMerkleRoots = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/merkle-roots', {
        headers: {
          'Authorization': `Bearer ${token}`, // Sende das Admin-Ticket mit
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRoots(data);
      } else {
        throw new Error(data.msg || 'Fehler beim Laden der Merkle Roots');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Funktion, um einen neuen Merkle Root zu generieren
  const handleGenerateRoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    // Wandle den Textbereich in ein Array von Adressen um
    const addresses = walletAddresses.split('\n').filter(addr => addr.trim() !== '');

    try {
      const response = await fetch('http://localhost:5000/api/admin/generate-merkle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newListName, walletAddresses: addresses }),
      });
      const data = await response.json();
      setMessage(data.msg);
      if (response.ok) {
        fetchMerkleRoots(); // Lade die Liste neu, um den neuen Eintrag zu sehen
        setNewListName("");
        setWalletAddresses("");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ein Fehler ist aufgetreten.");
    }
  };
  
  // Lade die Daten, wenn die Komponente geladen wird und ein Token vorhanden ist
  useEffect(() => {
    fetchMerkleRoots();
  }, [token]);

  return (
    <ProtectedAdminRoute>
      <main style={{ padding: '2rem' }}>
        <h1>Admin Dashboard</h1>

        <section style={{ marginTop: '2rem' }}>
          <h2>Neuen Merkle Root generieren</h2>
          <form onSubmit={handleGenerateRoot}>
            <input
              type="text"
              placeholder="Name der Allowlist (z.B. Phase 1)"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              required
              style={{ display: 'block', marginBottom: '0.5rem', minWidth: '300px' }}
            />
            <textarea
              placeholder="Eine Wallet-Adresse pro Zeile"
              value={walletAddresses}
              onChange={(e) => setWalletAddresses(e.target.value)}
              required
              rows={10}
              style={{ display: 'block', marginBottom: '0.5rem', minWidth: '400px' }}
            />
            <button type="submit">Generieren & Speichern</button>
          </form>
          {message && <p>{message}</p>}
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>Gespeicherte Merkle Roots</h2>
          {roots.length > 0 ? (
            <ul>
              {roots.map(root => (
                <li key={root._id}>
                  <strong>{root.name}:</strong> <code>{root.root}</code>
                </li>
              ))}
            </ul>
          ) : (
            <p>Keine Merkle Roots gefunden.</p>
          )}
        </section>
      </main>
    </ProtectedAdminRoute>
  );
}