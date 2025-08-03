// frontend/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // Globale CSS-Datei importieren
import { Providers } from "@/context/Web3Provider"; // Dieser Pfad funktioniert dank des Alias weiterhin
import { form } from "viem/chains";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreedomProject dApp",
  description: "Interact with the FreedomProject ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}