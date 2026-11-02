FROM node:22-bookworm-slim AS deps

WORKDIR /app

# better-sqlite3 may need node-gyp to compile its native addon.
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci


# ==========================================
# BUILDER
# ==========================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir -p public \
    && npm run build \
    && npm prune --omit=dev


# ==========================================
# PRODUCTION RUNNER
# ==========================================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
# Package files
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Next.js build
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Background workers
COPY --from=builder --chown=nextjs:nodejs /app/queues ./queues

# SQL and MongoDB seed files
COPY --from=builder --chown=nextjs:nodejs /app/ingestion ./ingestion
COPY --from=builder --chown=nextjs:nodejs /app/mongodb-mongoose-sql-lab ./mongodb-mongoose-sql-lab

# Shared application modules
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib
COPY --from=builder --chown=nextjs:nodejs /app/db ./db
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
