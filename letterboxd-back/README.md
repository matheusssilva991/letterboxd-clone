# Letterboxd Clone - Backend

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

## 📝 Sobre

Backend da aplicação Letterboxd Clone desenvolvido com **NestJS**. Esta API REST fornece todos os endpoints necessários para gerenciar usuários, filmes, avaliações, atores, diretores e gêneros.

### ✨ Características

- 🔐 **Autenticação JWT** com Passport
- 🛡️ **Guards e Middlewares** para segurança
- 💾 **Cache com Redis** para otimização de performance
- 🗄️ **TypeORM** para interação com banco de dados
- 🚦 **Rate Limiting** para proteção contra abuso
- 📁 **Upload de arquivos** para imagens de filmes e perfis
- 🔄 **Versionamento de API**
- 📊 **Logging** de requisições
- ✅ **Validação** automática de DTOs

## 🏗️ Arquitetura

A aplicação segue os princípios do **NestJS**, organizando o código em módulos, controllers e services:

```
src/
├── common/              # Recursos compartilhados
│   ├── decorators/      # Decorators customizados (@Roles, etc)
│   ├── guards/          # Guards de autenticação e autorização
│   ├── middlewares/     # Middlewares HTTP (logging, etc)
│   ├── helpers/         # Funções auxiliares
│   └── types/           # Tipos TypeScript customizados
├── modules/             # Módulos da aplicação
│   ├── auth/           # Autenticação e geração de tokens
│   ├── user/           # CRUD de usuários
│   ├── movie/          # CRUD de filmes
│   ├── movie_review/   # Sistema de avaliações
│   ├── actor/          # Gerenciamento de atores
│   ├── director/       # Gerenciamento de diretores
│   ├── genre/          # Gerenciamento de gêneros
│   ├── movie_actor/    # Relação filmes-atores
│   ├── movie_director/ # Relação filmes-diretores
│   ├── movie_genre/    # Relação filmes-gêneros
│   └── file/           # Upload e gerenciamento de arquivos
├── app.module.ts        # Módulo raiz da aplicação
└── main.ts              # Ponto de entrada da aplicação
```

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Propósito |
|------------|-----------|
| **NestJS** | Framework Node.js progressivo para construção de aplicações server-side |
| **TypeScript** | Superset JavaScript com tipagem estática |
| **TypeORM** | ORM para TypeScript que suporta múltiplos bancos de dados |
| **MySQL** | Sistema de gerenciamento de banco de dados relacional |
| **Redis** | Banco de dados em memória para cache |
| **Passport** | Middleware de autenticação com estratégias JWT e Local |
| **JWT** | Tokens para autenticação stateless |
| **class-validator** | Validação declarativa de objetos |
| **class-transformer** | Transformação de objetos plain para classes |
| **Bcrypt** | Hashing de senhas |
| **Multer** | Middleware para upload de arquivos |
| **Docker** | Containerização da aplicação |

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Docker** >= 20.10 ([Download](https://www.docker.com/get-started))
- **Docker Compose** >= 2.0 ([Instalação](https://docs.docker.com/compose/install/))

**OU** (para desenvolvimento sem Docker):

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (incluído com Node.js)
- **MySQL** >= 8.0 ([Download](https://dev.mysql.com/downloads/))
- **Redis** >= 6.0 ([Download](https://redis.io/download))

## 🚀 Instalação e Execução

### Opção 1: Com Docker (Recomendado)

Esta é a forma mais simples de executar o projeto, pois o Docker Compose gerencia automaticamente MySQL, Redis e a aplicação.

1. **Clone o repositório**

   ```bash
   git clone https://github.com/matheusssilva991/letterboxd-clone
   cd letterboxd-clone/letterboxd-back
   ```

2. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` conforme necessário. As configurações padrão já funcionam com Docker.

3. **Inicie os containers**

   ```bash
   docker-compose up -d
   ```

   Este comando irá:
   - Baixar as imagens necessárias (MySQL, Redis)
   - Construir a imagem da aplicação
   - Iniciar todos os serviços
   - Criar o banco de dados automaticamente

4. **Verifique se está rodando**

   ```bash
   docker-compose ps
   ```

   Todos os serviços devem estar com status `Up`.

5. **Acesse a aplicação**

   A API estará disponível em: `http://localhost:3000/api`

#### Comandos úteis do Docker

```bash
# Ver logs da aplicação
docker-compose logs -f app

# Ver logs de todos os serviços
docker-compose logs -f

# Parar os containers
docker-compose down

# Parar e remover volumes (limpa o banco de dados)
docker-compose down -v

# Reconstruir a imagem após alterações
docker-compose up -d --build
```

### Opção 2: Sem Docker

Para ambiente de desenvolvimento local sem Docker:

1. **Clone o repositório**

   ```bash
   git clone https://github.com/matheusssilva991/letterboxd-clone
   cd letterboxd-clone/letterboxd-back
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure o banco de dados**

   Certifique-se de que o MySQL está rodando e crie o banco de dados:

   ```sql
   CREATE DATABASE letterboxd;
   ```

4. **Configure o Redis**

   Inicie o Redis server:

   ```bash
   redis-server
   ```

5. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

   Edite o `.env` com suas credenciais locais:

   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USERNAME=root
   MYSQL_PASSWORD=sua_senha
   MYSQL_DATABASE=letterboxd

   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

6. **Execute a aplicação**

   ```bash
   # Modo desenvolvimento (com hot-reload)
   npm run start:dev

   # Modo produção
   npm run build
   npm run start:prod

   # Modo debug
   npm run start:debug
   ```

## 📂 Estrutura do Projeto

```
letterboxd-back/
├── config/                    # Arquivos de configuração
│   ├── cache.config.ts       # Configuração do Redis
│   ├── multer.config.ts      # Configuração de upload de arquivos
│   ├── throttler.config.ts   # Configuração de rate limiting
│   └── typeorm.config.ts     # Configuração do banco de dados
├── dev_files/                 # Arquivos auxiliares de desenvolvimento
│   ├── letterboxd.dbm        # Modelo do banco de dados
│   └── letterboxd.postman.json # Collection do Postman
├── uploads/                   # Diretório de arquivos enviados
├── src/
│   ├── common/               # Recursos compartilhados
│   │   ├── decorators/       # @Roles() e outros decorators
│   │   ├── enums/           # Enumerações (RoleEnum)
│   │   ├── guards/          # JwtAuthGuard, RoleGuard
│   │   ├── helpers/         # Funções auxiliares
│   │   ├── middlewares/     # LoggingMiddleware
│   │   └── types/           # Tipos TypeScript
│   ├── modules/             # Módulos da aplicação
│   │   ├── auth/           # Autenticação JWT
│   │   │   ├── strategy/   # Passport strategies
│   │   │   ├── dto/        # Data Transfer Objects
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── user/           # Gerenciamento de usuários
│   │   │   ├── entities/   # User entity
│   │   │   ├── dto/        # CreateUserDto, UpdateUserDto, etc
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.module.ts
│   │   ├── movie/          # Catálogo de filmes
│   │   ├── movie_review/   # Sistema de avaliações
│   │   ├── actor/          # Atores
│   │   ├── director/       # Diretores
│   │   ├── genre/          # Gêneros
│   │   ├── movie_actor/    # Relação N:N filmes-atores
│   │   ├── movie_director/ # Relação N:N filmes-diretores
│   │   ├── movie_genre/    # Relação N:N filmes-gêneros
│   │   └── file/           # Upload de arquivos
│   ├── app.controller.ts    # Controller raiz
│   ├── app.service.ts       # Service raiz
│   ├── app.module.ts        # Módulo principal
│   └── main.ts              # Bootstrap da aplicação
├── test/                     # Testes E2E
├── docker-compose.yml        # Orquestração de containers
├── Dockerfile                # Imagem Docker da aplicação
├── nest-cli.json            # Configuração do NestJS CLI
├── tsconfig.json            # Configuração do TypeScript
├── package.json             # Dependências e scripts
└── README.md                # Este arquivo
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

### Configurações da Aplicação

```env
# Ambiente de execução (development, production, test)
NODE_ENV=development

# Porta da aplicação
PORT=3000
```

### Configurações do MySQL

```env
MYSQL_HOST=mysql               # Nome do serviço no docker-compose
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=root123
MYSQL_DATABASE=letterboxd
```

### Configurações do Redis

```env
REDIS_HOST=redis               # Nome do serviço no docker-compose
REDIS_PORT=6379
REDIS_TTL=300                  # Tempo de vida do cache em segundos
```

### Configurações de Autenticação

```env
JWT_SECRET=seu_secret_super_secreto_aqui
EXPIRES_IN=7d                  # Duração do token (ex: 1h, 7d, 30d)
```

### Configurações de Rate Limiting

```env
THROTTLE_TTL=60000            # Janela de tempo em ms
THROTTLE_LIMIT=10             # Número máximo de requisições por janela
```

### Configurações de Upload

```env
UPLOAD_DIR=./uploads          # Diretório para arquivos enviados
MAX_FILE_SIZE=5242880         # Tamanho máximo em bytes (5MB)
```

## 📡 Endpoints Principais da API

A API segue o padrão REST e está versionada. Todos os endpoints começam com `/api`.

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/login` | Fazer login e obter token JWT | Não |
| POST | `/api/auth/register` | Registrar novo usuário | Não |
| PUT | `/api/auth/password` | Atualizar senha do usuário | Sim |

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/users` | Listar todos os usuários | Sim |
| GET | `/api/users/:id` | Obter detalhes de um usuário | Sim |
| POST | `/api/users` | Criar novo usuário | Admin |
| PUT | `/api/users/:id` | Atualizar usuário | Admin/Owner |
| DELETE | `/api/users/:id` | Deletar usuário | Admin |

### Filmes

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/movies` | Listar filmes (com filtros e paginação) | Não |
| GET | `/api/movies/:id` | Obter detalhes de um filme | Não |
| POST | `/api/movies` | Adicionar novo filme | Admin |
| PUT | `/api/movies/:id` | Atualizar filme | Admin |
| DELETE | `/api/movies/:id` | Deletar filme | Admin |

### Avaliações

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/reviews` | Listar avaliações | Não |
| GET | `/api/reviews/:id` | Obter avaliação específica | Não |
| POST | `/api/reviews` | Criar nova avaliação | Sim |
| PUT | `/api/reviews/:id` | Atualizar avaliação própria | Owner |
| DELETE | `/api/reviews/:id` | Deletar avaliação própria | Owner/Admin |

### Outros Endpoints

- **Atores**: `/api/actors` (GET, POST, PUT, DELETE)
- **Diretores**: `/api/directors` (GET, POST, PUT, DELETE)
- **Gêneros**: `/api/genres` (GET, POST, PUT, DELETE)

### Parâmetros de Query Comuns

```
?page=1              # Página atual (paginação)
?limit=10            # Itens por página
?order=createdAt:DESC # Ordenação (campo:direção)
?include=actor,genre # Incluir relações
?title=Matrix        # Filtro por título (busca parcial)
```

### Exemplo de Requisição

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123"}'

# Listar filmes com filtros
curl http://localhost:3000/api/movies?title=matrix&limit=5&include=actors,genres

# Criar avaliação (com token)
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"movieId":1,"rating":5,"comment":"Excelente filme!"}'
```

## 🧪 Testes

O projeto utiliza **Jest** para testes unitários e E2E.

### Executar testes

```bash
# Todos os testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Testes E2E
npm run test:e2e

# Cobertura de código
npm run test:cov
```

## 🤝 Contribuição

Contribuições são muito bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação de código
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de build/config

## 📄 Licença

Este projeto é licenciado sob a licença UNLICENSED - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**Matheus S. Silva**

- GitHub: [@matheusssilva991](https://github.com/matheusssilva991)

## 📞 Suporte

Para reportar bugs ou solicitar features:

- Abra uma [issue](https://github.com/matheusssilva991/letterboxd-clone/issues)
- Entre em contato via GitHub

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!

**Feito com ❤️ e NestJS**

Se precisar de algo mais específico, é só avisar! 🚀
