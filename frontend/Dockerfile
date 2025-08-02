# 1. Basis-Image auswählen
FROM node:20-alpine

# 2. Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# 3. ZUERST nur die package-Dateien aus dem frontend-Ordner kopieren
COPY frontend/package*.json ./

# 4. Die Vertrags-Artefakte in einen neuen Ordner kopieren
#    Dieser Schritt ist der Schlüssel zur Lösung des Problems.
COPY build/contracts ./src/lib/artifacts/

# 5. Abhängigkeiten installieren
RUN npm install

# 6. DANACH den gesamten restlichen Code aus dem frontend-Ordner kopieren
COPY frontend/ .

# 7. Die Next.js-Anwendung für die Produktion bauen
RUN npm run build

# 8. Den optimierten Next.js-Server starten
CMD ["npm", "start"]