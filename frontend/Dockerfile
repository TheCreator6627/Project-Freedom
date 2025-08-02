# 1. Basis-Image
FROM node:20-alpine

# 2. Arbeitsverzeichnis
WORKDIR /app

# 3. Nur package-Dateien kopieren
COPY package*.json ./

# 4. Abhängigkeiten installieren
RUN npm install

# 5. Restlichen Code kopieren
COPY . .

# 🚫 Diese Zeile muss WEG, sonst Fehler:
# COPY build/contracts ./src/lib/artifacts/

# 6. Build starten
RUN npm run build

# 7. Start
CMD ["npm", "start"]
