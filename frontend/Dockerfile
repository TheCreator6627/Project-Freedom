# 1. Basis-Image mit korrekter Node-Version
FROM node:20-alpine

# 2. Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# 3. ZUERST nur die package-Dateien kopieren
COPY package*.json ./

# 4. Abhängigkeiten installieren
RUN npm install

# 5. DANACH den gesamten restlichen Code kopieren
COPY . .

# 6. Die Next.js-Anwendung für die Produktion bauen
RUN npm run build

# 7. Den optimierten Next.js-Server starten
CMD ["npm", "start"]