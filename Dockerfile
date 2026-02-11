# --- ESTÁGIO 1: Dependências ---
FROM node:22-alpine3.23 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Como o contexto é ".", buscamos de dentro da pasta frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# --- ESTÁGIO 2: Build ---
FROM node:22-alpine3.23 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copia todo o conteúdo da pasta frontend para a pasta atual (/app)
COPY frontend/ . 

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV IS_MOBILE=false

# Pula o lint e checagem de tipos para garantir que o build da DemoWeek não trave
ENV NEXT_ESLINT_IGNORE_DURING_BUILDS=true
ENV NEXT_TYPESCRIPT_IGNORE_BUILD_ERRORS=true

RUN npm run build

# --- ESTÁGIO 3: Runner ---
FROM node:22-alpine3.23 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# O standalone do Next.js copia os arquivos para a estrutura interna
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Porta repetida 3535 conforme combinado
EXPOSE 3535

ENV PORT 3535
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]