# 1. Basis-Image auswählen
FROM node:18-alpine

# 2. Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# 3. ZUERST nur die package-Dateien kopieren
# Dieser Schritt ist entscheidend für das Caching.
COPY package*.json ./

# 4. Abhängigkeiten installieren
# Dieser langsame Schritt wird nur ausgeführt, wenn sich die package.json ändert.
RUN npm install

# 5. DANACH den gesamten restlichen Code kopieren
COPY . .

# 6. Die Next.js-Anwendung für die Produktion bauen
RUN npm run build

# 7. Den optimierten Next.js-Server starten
CMD ["npm", "start"]