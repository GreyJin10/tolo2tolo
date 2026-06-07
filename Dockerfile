# ─── Build Stage ───
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── Runtime Stage ───
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/src/generated ./src/generated

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:/data/dev.db
ENV HOSTNAME=0.0.0.0
ENV PORT=8080

EXPOSE 8080

# Startup: migrate then start
CMD npx prisma migrate deploy && node node_modules/.bin/next start -p 8080
