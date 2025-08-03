# =========================================================================
# STAGE 1: Dependency Installation
# Installiert nur die Dependencies, um das Caching zu maximieren.
# =========================================================================
FROM node:20-alpine AS deps
LABEL stage="dependencies"

# Alpine-Pakete für native Dependencies (z.B. für sharp/Canvas)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Kopiere nur die package-Dateien aus dem Frontend-Verzeichnis
COPY frontend/package.json frontend/package-lock.json* ./

# Installiere alle Dependencies
RUN npm install --frozen-lockfile

# =========================================================================
# STAGE 2: Code Builder
# Baut den Quellcode der Anwendung.
# =========================================================================
FROM node:20-alpine AS builder
LABEL stage="builder"

WORKDIR /app

# Kopiere die zuvor installierten node_modules
COPY --from=deps /app/node_modules ./node_modules

# Kopiere den gesamten Frontend-Code
COPY frontend/ .

# Führe den Production Build aus (Next.js erkennt automatisch den Standalone-Modus)
RUN npm run build

# =========================================================================
# STAGE 3: Production Runner
# Erstellt das finale, minimale und sichere Image für den Betrieb.
# =========================================================================
FROM node:20-alpine AS runner
LABEL stage="production-runner"

WORKDIR /app

# Setze Umgebungsvariablen für den Production-Betrieb
ENV NODE_ENV production
ENV PORT 3000

# Erstelle einen dedizierten, unprivilegierten Benutzer für den Betrieb der Anwendung
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiere die Standalone-Ausgabe vom Builder
# Dies beinhaltet den optimierten Server und die kopierten node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Kopiere die statischen Assets (JS, CSS, Bilder etc.)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Kopiere alle öffentlichen Assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Wechsle zum unprivilegierten Benutzer
USER nextjs

# Exponiere den Port, auf dem die App läuft
EXPOSE 3000

# Der Befehl zum Starten des optimierten Node.js-Servers
CMD ["node", "server.js"]