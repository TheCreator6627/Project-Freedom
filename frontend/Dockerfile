# Dockerfile.frontend
# =========================================================================
# STAGE 1: Dependency Installation
# =========================================================================
FROM node:20-alpine AS deps
LABEL stage="dependencies"
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --frozen-lockfile

# =========================================================================
# STAGE 2: Code Builder
# =========================================================================
FROM node:20-alpine AS builder
LABEL stage="builder"
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
RUN npm run build

# =========================================================================
# STAGE 3: Production Runner
# =========================================================================
FROM node:20-alpine AS runner
LABEL stage="production-runner"
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]