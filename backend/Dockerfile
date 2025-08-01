# 1. Basis-Image auswählen
FROM node:18-alpine

# 2. Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# 3. ZUERST nur die package-Dateien kopieren
COPY package*.json ./

# 4. Abhängigkeiten installieren
# Auch hier wird der Schritt nur bei Änderungen an der package.json wiederholt.
RUN npm install

# 5. DANACH den gesamten restlichen Code kopieren
COPY . .

# 6. Den Server starten
CMD ["node", "server.js"]