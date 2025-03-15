# Base stage
FROM node:22-alpine3.20 AS base
WORKDIR /app

# Development stage
FROM base AS dev
ENV NODE_ENV=development

# Instalar PNPM globalmente
RUN npm install -g pnpm@9.14.2

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias sin ejecutar scripts post-instalación
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copiar el resto del código fuente
COPY . .

# Construcción para desarrollo
RUN pnpm run build

# Development Nginx stage
FROM nginx:alpine AS development
COPY ./nginx/nginx-dev.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=dev /app/dist . 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Production stage
FROM nginx:alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/share/nginx/html
COPY --from=dev /app/dist .
COPY ./nginx/nginx-prod.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


