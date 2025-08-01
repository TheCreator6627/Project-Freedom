# 1. Basis-Image auf Node 20 aktualisieren
FROM node:20-alpine

# 2. Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# 3. ZUERST nur die package-Dateien kopieren
COPY package*.json ./

# 4. Abhängigkeiten installieren
RUN npm install

# 5. DANACH den gesamten restlichen Code kopieren
COPY . .

# 6. Den Server starten
CMD ["node", "server.js"]