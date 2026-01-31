#!/bin/sh

# Substitui __API_URL__ pelo valor real da variável de ambiente
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__NEXT_PUBLIC_API_URL__|${NEXT_PUBLIC_API_URL}|g" {} +
find /usr/share/nginx/html -type f -name "*.html" -exec sed -i "s|__NEXT_PUBLIC_API_URL__|${NEXT_PUBLIC_API_URL}|g" {} +

# Inicia o nginx
exec nginx -g "daemon off;"