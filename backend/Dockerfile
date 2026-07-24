FROM node:20-alpine AS dependencies

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder

WORKDIR /usr/app
COPY --from=dependencies /usr/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /usr/app
ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=builder --chown=node:node /usr/app/dist ./dist
RUN mkdir -p /usr/app/uploads \
    && chown node:node /usr/app/uploads

USER node
EXPOSE 3001

CMD ["node", "dist/src/main.js"]
