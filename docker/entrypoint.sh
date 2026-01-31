#!/bin/sh

# Substitui o placeholder pelo valor real da variável de ambiente
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__NEXT_PUBLIC_API_URL__|${NEXT_PUBLIC_API_URL}|g" {} +
find /usr/share/nginx/html -type f -name "*.html" -exec sed -i "s|__NEXT_PUBLIC_API_URL__|${NEXT_PUBLIC_API_URL}|g" {} +

# Chama o entrypoint original do nginx
exec /docker-entrypoint.sh nginx -g "daemon off;"