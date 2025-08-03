// src/app/admin/dashboard/page.tsx
"use client";

import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute';
// KORREKTUR: Wir importieren jetzt 'useAuth', nicht 'useAdminSession'.
import { useAuth } from '@/context/AdminSession'; 

function DashboardContent() {
  // KORREKTUR: Wir verwenden jetzt den importierten 'useAuth'-Hook.
  const { token } = useAuth(); // Das '|| {}' ist nicht nötig.
  
  return <div>Admin Dashboard - Dein Token: {token ? 'Vorhanden' : 'Nicht vorhanden'}</div>;
}

export default function AdminDashboardPage() {
  return (
    // KORREKTUR: Der redundante Provider wurde entfernt.
    // Der Kontext wird von der layout.tsx-Datei vererbt.
    <ProtectedAdminRoute>
      <h1 className="text-3xl font-bold">Admin Bereich</h1>
      <DashboardContent />
    </ProtectedAdminRoute>
  );
}