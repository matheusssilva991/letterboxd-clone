# Estágio de construção
FROM node:20-alpine AS builder

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

# Estágio de produção
FROM node:20-alpine

WORKDIR /usr/app

COPY --from=builder /usr/app/dist ./dist

COPY package*.json ./

RUN npm install --production

CMD ["npm", "start"]
