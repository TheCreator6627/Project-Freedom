# =========================================================================
# STAGE 1: Dependencies
# Installiert alle nötigen Pakete basierend auf der Lock-Datei.
# =========================================================================
FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
# 'npm ci' ist der Standard für reproduzierbare Builds und installiert auch devDependencies.
RUN npm ci

# =========================================================================
# STAGE 2: Builder
# Baut die Next.js-Anwendung im optimierten Produktionsmodus.
# =========================================================================
FROM node:24-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 'npm run build' läuft standardmäßig korrekt für die Produktion.
# Ein explizites 'ENV NODE_ENV' ist hier nicht nötig und vermeidet Warnungen.
RUN npm run build

# =========================================================================
# STAGE 3: Production Runner
# Erstellt das minimale, sichere Image für den Live-Betrieb.
# =========================================================================
FROM node:24-alpine AS runner
WORKDIR /app

# Hier wird die Umgebung explizit auf 'production' gesetzt.
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Kopiere NUR die für den Betrieb notwendigen Dateien aus dem Builder.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]