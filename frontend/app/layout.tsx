// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css"; // <-- CSS für RainbowKit importieren
import { Web3Provider } from "@/context/Web3Provider";
import { AdminSessionProvider } from "@/context/AdminSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreedomProject",
  description: "The Freedom Project dApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <AdminSessionProvider>
            {children}
          </AdminSessionProvider>
        </Web3Provider>
      </body>
    </html>
  );
}