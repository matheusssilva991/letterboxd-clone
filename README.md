# Letterboxd Clone

<span id="topo"></span>

![Status do projeto](https://img.shields.io/badge/status-em%20desenvolvimento-green)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

> Clone da plataforma Letterboxd - Uma rede social para cinéfilos compartilharem e avaliarem filmes

## 📋 Sobre o Projeto

Este projeto é uma réplica do Letterboxd, uma popular plataforma de descoberta de filmes e rede social para cinéfilos. O objetivo é criar uma aplicação completa que permita aos usuários:

- 🎬 Catalogar e descobrir filmes
- ⭐ Avaliar e revisar filmes assistidos
- 📝 Escrever e compartilhar críticas
- 👥 Seguir outros usuários e suas listas
- 🎭 Explorar filmes por atores, diretores e gêneros
- 📊 Visualizar estatísticas pessoais de visualização

## 🚩 Status do Projeto

**Em desenvolvimento ativo** - Backend NestJS e frontend Next.js funcionais.

## 🏗️ Arquitetura

O projeto está organizado em módulos:

- **Backend (NestJS)**: API REST com TypeScript, MySQL e Redis
- **Frontend**: Next.js com App Router
- **Proxy reverso**: Nginx

## 🛠️ Tecnologias

### Backend

- **NestJS** - Framework Node.js progressivo
- **TypeORM** - ORM para TypeScript e JavaScript
- **MySQL** - Banco de dados relacional
- **Redis** - Cache em memória
- **JWT** - Autenticação e autorização
- **Passport** - Middleware de autenticação
- **Docker** - Containerização

## 💻 Pré-requisitos

Antes de começar, verifique se você tem instalado:

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Node.js** >= 20.9 (opcional, apenas para desenvolvimento sem Docker)
- **npm** ou **yarn**

## 🚀 Instalando o Letterboxd Clone

### 1. Clone o repositório

```bash
git clone https://github.com/matheusssilva991/letterboxd-clone
cd letterboxd-clone
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações de banco de dados, Redis, JWT, etc.

O arquivo `.env.example` documenta as variáveis usadas pelo Compose. O `.env`
contém os valores reais e não deve ser versionado. Em produção, substitua todos
os segredos de exemplo e configure `APP_ORIGIN` com o domínio HTTPS real.

### 3. Instale as dependências (se não for usar Docker)

```bash
cd backend && npm ci
cd ../frontend && npm ci
```

## ☕ Executando o Projeto

### Desenvolvimento com Docker

O arquivo de desenvolvimento usa hot reload, bind mounts e publica as portas dos
serviços:

```bash
docker compose -f docker-compose.dev.yml up --build
```

A aplicação estará disponível em `http://localhost:3000` e a API em
`http://localhost:3001/api/v1`.

### Produção com Docker

O Compose principal constrói imagens enxutas, mantém banco, Redis e aplicações
sem portas públicas e expõe somente o Nginx:

```bash
cp .env.example .env
# Edite o .env antes de continuar.
docker compose up -d --build
```

O site estará disponível na porta definida por `HTTP_PORT` (80 por padrão).
Para internet pública, configure TLS no Nginx ou em um load balancer à frente.

> `DB_SYNCHRONIZE=false` é obrigatório em produção. Antes do primeiro deploy,
> crie e execute migrations do TypeORM para preparar o banco.

### Sem Docker

Certifique-se de ter o MySQL e Redis rodando localmente, então:

```bash
cd backend

# Desenvolvimento com hot-reload
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 🎞️ Dados de demonstração

O seed importa filmes populares, gêneros, elenco, direção e imagens do TMDB.
Usuários e críticas são fictícios e gerados localmente. A execução é
idempotente: rodar novamente não duplica os mesmos registros.

1. Crie uma conta no TMDB e copie o **API Read Access Token** (preferível) ou
   a **API Key v3**.
2. Defina `TMDB_ACCESS_TOKEN` ou `TMDB_API_KEY` no `.env` da raiz.
3. Com o ambiente de desenvolvimento em execução, rode:

```bash
docker compose -f docker-compose.dev.yml exec back npm run seed
```

Por padrão são importados até 50 filmes e criados 15 usuários e 100 críticas.
Essas quantidades podem ser alteradas pelas variáveis `SEED_MOVIE_LIMIT`,
`SEED_USER_COUNT` e `SEED_REVIEW_COUNT`. Todos os usuários fictícios usam a
senha definida em `SEED_USER_PASSWORD`.

Em uma imagem de produção já construída, use:

```bash
docker compose run --rm back npm run seed:prod
```

## 📚 Documentação da API

Após iniciar o servidor, você pode acessar:

- **API Base em desenvolvimento**: `http://localhost:3001/api/v1`
- **API Base em produção**: `/api/v1` na mesma origem do site
- **Endpoints disponíveis**:
  - `/api/v1/auth` - Autenticação e autorização
  - `/api/v1/users` - Gerenciamento de usuários
  - `/api/v1/movies` - Catálogo de filmes
  - `/api/v1/reviews` - Avaliações e críticas
  - `/api/v1/actors` - Atores
  - `/api/v1/directors` - Diretores
  - `/api/v1/genres` - Gêneros

## 🧪 Executando os Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📁 Estrutura do Projeto

```
letterboxd-clone/
├── backend/                  # Backend NestJS
│   ├── config/              # Configurações (TypeORM, Cache, etc)
│   ├── src/
│   │   ├── common/          # Utilities compartilhados
│   │   │   ├── decorators/  # Decorators customizados
│   │   │   ├── guards/      # Guards de autenticação
│   │   │   └── middlewares/ # Middlewares HTTP
│   │   ├── modules/         # Módulos da aplicação
│   │   │   ├── auth/        # Autenticação JWT
│   │   │   ├── user/        # Usuários
│   │   │   ├── movie/       # Filmes
│   │   │   ├── actor/       # Atores
│   │   │   ├── director/    # Diretores
│   │   │   ├── genre/       # Gêneros
│   │   │   └── movie_review/# Avaliações
│   │   └── main.ts          # Entry point
│   └── Dockerfile           # Imagem Docker da aplicação
├── frontend/                 # Frontend Next.js
├── nginx/                    # Configuração do proxy reverso
├── docker-compose.yml        # Produção
├── docker-compose.dev.yml    # Desenvolvimento
├── .env.example              # Modelo das variáveis
└── README.md                # Este arquivo
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença UNLICENSED. É um projeto educacional para fins de aprendizado.

## 👨‍💻 Autor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/matheusssilva991">
        <img src="https://github.com/matheusssilva991.png" width="100px;" alt="Foto do Matheus S.Silva no GitHub"/><br>
        <b>Matheus S. Silva</b>
        <p>Desenvolvedor Full Stack</p>
      </a>
    </td>
  </tr>
</table>

## 📞 Contato

Para dúvidas ou sugestões, abra uma [issue](https://github.com/matheusssilva991/letterboxd-clone/issues) no repositório.

---

[⬆ Voltar ao topo](#topo)
