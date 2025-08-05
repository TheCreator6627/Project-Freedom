// app/admin/layout.tsx
// WICHTIG: Verwenden Sie "use client", da der AdminSessionProvider ein Client Component ist
"use client";

import React from 'react';
import { AdminSessionProvider } from "@/context/AdminSession"; // Pfad anpassen

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSessionProvider>
      {children}
    </AdminSessionProvider>
  );
}