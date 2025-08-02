# 1. Basis-Image mit korrekter Node-Version
FROM node:20-alpine

# 2. Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# 3. ZUERST nur die package-Dateien kopieren
COPY package*.json ./

# 4. Abhängigkeiten installieren
# Dieser langsame Schritt wird nur ausgeführt, wenn sich die package.json ändert.
CMD ["npx", "next", "start"]


# 5. DANACH den gesamten restlichen Code kopieren
COPY . .

# 6. Den Server starten
CMD ["node", "server.js"]