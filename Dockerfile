FROM node:20-alpine AS builder
WORKDIR /app

# Define a variável de ambiente durante o build
ENV NEXT_PUBLIC_API_URL=/api

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]