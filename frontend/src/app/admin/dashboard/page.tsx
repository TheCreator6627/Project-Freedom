"use client";

import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute'; // KORRIGIERT
import { AdminSessionProvider, useAdminSession } from '@/context/AdminSession'; // KORRIGIERT

function DashboardContent() {
  const { token } = useAdminSession() || {};
  return <div>Admin Dashboard - Dein Token: {token ? 'Vorhanden' : 'Nicht vorhanden'}</div>;
}

export default function AdminDashboardPage() {
  return (
    <AdminSessionProvider>
      <ProtectedAdminRoute>
        <h1 className="text-3xl font-bold">Admin Bereich</h1>
        <DashboardContent />
      </ProtectedAdminRoute>
    </AdminSessionProvider>
  );
}