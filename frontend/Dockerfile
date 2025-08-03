# =========================================================================
# STAGE 1: Dependencies (inkl. Tailwind)
# =========================================================================
FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# =========================================================================
# STAGE 2: Build mit Tailwind, Next.js etc.
# =========================================================================
FROM node:24-alpine AS builder
WORKDIR /app

# Setze NODE_ENV auf development für vollständigen Build inkl. devDependencies
ENV NODE_ENV=development

# Kopiere Dependencies und Projektdateien
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Baue die Anwendung (Next.js "standalone"-Modus mit Tailwind)
RUN npm run build

# =========================================================================
# STAGE 3: Production Runner
# =========================================================================
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Kopiere das gebaute Next.js-Standalone-Projekt
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Zusätzlich benötigte Assets wie CSS, Konfigs und Public-Verzeichnis
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/styles ./styles
COPY --from=builder --chown=nextjs:nodejs /app/tailwind.config.js ./tailwind.config.js
COPY --from=builder --chown=nextjs:nodejs /app/postcss.config.js ./postcss.config.js

# Falls du deine globale CSS-Datei woanders hast, ggf. diesen Pfad anpassen
COPY --from=builder --chown=nextjs:nodejs /app/src/app/globals.css ./src/app/globals.css

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]