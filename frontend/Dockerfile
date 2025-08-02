# ----------- STAGE 1: Build ----------
FROM node:20-alpine AS builder

# Arbeitsverzeichnis setzen
WORKDIR /app

# Nur package-Dateien kopieren (schneller Caching)
COPY frontend/package*.json ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./

# Dependencies installieren
RUN npm install

# Restlichen Code kopieren
COPY frontend/ .

# Production Build ausführen
RUN npm run build

# ----------- STAGE 2: Runtime ----------
FROM node:20-alpine AS runner

# Setze ein minimales Arbeitsverzeichnis
WORKDIR /app

# Nur das Nötigste kopieren (keine node_modules)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Wenn du Tailwind im Code nutzt, brauchst du KEIN tailwind zur Laufzeit

# Installiere nur Runtime-Dependencies
RUN npm install --omit=dev

# Next.js braucht dies für den Start
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

# Starte die App
CMD ["npm", "start"]
