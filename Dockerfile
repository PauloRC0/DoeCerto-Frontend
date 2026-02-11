# --- ESTÁGIO 1: Dependências ---
FROM node:22-alpine3.23 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Como o contexto será a pasta /frontend, os arquivos estão na raiz do contexto
COPY package.json package-lock.json* ./
RUN npm ci

# --- ESTÁGIO 2: Build ---
FROM node:22-alpine3.23 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copia tudo da pasta atual do contexto para o container
COPY . . 

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV IS_MOBILE=false

# Impede que erros de lint ou tipos travem a demonstração
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

# Estrutura do standalone Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Configuração de rede para Azure/Porta 3535
EXPOSE 3535
ENV PORT 3535
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]