# Estágio de construção
FROM node:20-alpine AS builder

WORKDIR /usr/app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine

WORKDIR /usr/app

# Copiar package.json
COPY package*.json ./

# Instalar todas as dependências (nest precisa estar disponível)
RUN npm ci

# Copiar o build do estágio anterior
COPY --from=builder /usr/app/dist ./dist

# Copiar arquivos de configuração necessários
COPY --from=builder /usr/app/tsconfig.json ./
COPY --from=builder /usr/app/nest-cli.json ./

# Expor a porta
EXPOSE 3000

# Comando para iniciar (produção)
CMD ["npm", "run", "start:prod"]
