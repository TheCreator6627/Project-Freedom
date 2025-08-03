# frontend/Dockerfile

# =========================================================================
# STAGE 1: Dependency Installation
# Diese Stufe installiert sauber alle Dependencies basierend auf der neuen package-lock.json
# =========================================================================
FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./

# npm ci ist der Goldstandard für reproduzierbare Builds in Docker.
RUN npm ci

# =========================================================================
# STAGE 2: Code Builder
# Diese Stufe baut die Anwendung. Wir setzen explizit NODE_ENV, um Zweifel auszuschließen.
# =========================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Setzt die Umgebung für den Build-Prozess, um sicherzustellen, dass alle Tools funktionieren.
ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Führt den Production Build aus.
RUN npm run build

# =========================================================================
# STAGE 3: Production Runner
# Diese Stufe erstellt das minimale Image für den Live-Betrieb.
# =========================================================================
FROM node:20-alpine AS runner
WORKDIR /app

# Hier setzen wir die Umgebung auf 'production' für den Live-Betrieb.
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]