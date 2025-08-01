"use client";

import { useAuth } from "@/context/AdminSession";
import { useState } from "react";

export function AllowlistUpload() {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [listName, setListName] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !listName) {
      setMessage("Bitte Namen und Datei auswählen.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append('allowlistFile', file);
    formData.append('name', listName);

    try {
      const response = await fetch('http://localhost:5000/api/admin/upload-allowlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      setMessage(data.msg);
    } catch (err) {
      setMessage("Upload fehlgeschlagen.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="bg-gray-800 p-6 rounded-lg mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Allowlist per CSV hochladen</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Name der Allowlist"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-700 text-white mb-2"
        />
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          required
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        />
        <button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {isUploading ? 'Lade hoch...' : 'Hochladen & Merkle Root generieren'}
        </button>
      </form>
      {message && <p className="text-gray-400 mt-4">{message}</p>}
    </section>
  );
}