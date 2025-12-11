# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN rm -f package-lock.json && npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Etapa 2: Nginx
FROM nginx:alpine
RUN apk add --no-cache gettext
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

# ← Linha mágica que elimina o warning
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_HOST} ${BACKEND_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]