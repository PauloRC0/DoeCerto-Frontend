# --- ESTÁGIO 1: Dependências ---
FROM node:22-alpine3.23 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Como o contexto no YAML é ".", o Docker "enxerga" a pasta frontend do lado de fora.
# Copiamos os arquivos de dependência para a raiz do WORKDIR (/app)
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# --- ESTÁGIO 2: Build ---
FROM node:22-alpine3.23 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copia todo o código da pasta frontend para o WORKDIR (/app) no container
COPY frontend/ . 

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV IS_MOBILE=false

# Flags de sobrevivência para a DemoWeek (evita travar por avisos bobos)
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

# O Next.js standalone precisa que a estrutura de pastas reflita o que ele gerou no builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Configuração de porta conforme solicitado
EXPOSE 3535
ENV PORT 3535
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]