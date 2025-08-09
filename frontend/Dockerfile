# === Phase 1: Die Build-Phase ===
# Wir verwenden ein schlankes Node-Image zum Erstellen der Anwendung.
FROM node:22-alpine AS builder

# Festlegen des Arbeitsverzeichnisses im Container
WORKDIR /app

# Kopieren der 'package.json' und 'package-lock.json' vor dem Installieren der Abhängigkeiten.
# Dies nutzt das Docker-Layer-Caching, um `npm ci` zu überspringen, wenn sich die Abhängigkeiten nicht geändert haben.
COPY frontend/package*.json ./

# Installieren der Frontend-Abhängigkeiten
# 'npm ci' ist der Standard für reproduzierbare Builds und installiert auch devDependencies für den Build-Schritt.
RUN npm ci

# Kopieren der restlichen Projektdateien
COPY frontend/ .

# Erstellen des Produktions-Builds
RUN npm run build


# === Phase 2: Die Produktions-Phase (finales Image) ===
# Wir verwenden ein noch schlankeres Image ohne Build-Tools für die Produktion.
FROM node:22-alpine AS runner

# Festlegen des Arbeitsverzeichnisses
WORKDIR /app

# Kopieren der minimal erforderlichen Dateien aus der Build-Phase
# 1. package.json für den Startbefehl
COPY --from=builder /app/package.json ./package.json

# 2. Produktionsabhängigkeiten
# Wir kopieren nur die Pakete, die für die Laufzeit notwendig sind.
RUN npm install --omit=dev

# 3. Der fertige Next.js-Build
COPY --from=builder /app/.next ./.next

# 4. Statische Dateien und der öffentliche Ordner
COPY --from=builder /app/public ./public

# Setzen der Umgebung für die Produktion
ENV NODE_ENV production

# Exponieren des Ports, auf dem Next.js läuft
EXPOSE 3000

# Starten der Anwendung in der Produktion
CMD ["npm", "run", "start"]