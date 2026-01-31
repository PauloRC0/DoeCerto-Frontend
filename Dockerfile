FROM node:20-alpine AS builder
WORKDIR /app

# Usa um placeholder que será substituído em runtime
ENV NEXT_PUBLIC_API_URL=__NEXT_PUBLIC_API_URL__

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

# Copia os arquivos buildados
COPY --from=builder /app/out /usr/share/nginx/html

# Copia o script de entrypoint do diretório docker/
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# Usa o entrypoint customizado
ENTRYPOINT ["/entrypoint.sh"]