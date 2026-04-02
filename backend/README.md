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
- 🔄 **Versionamento de API** (v1)
- 📊 **Logging** de requisições
- ✅ **Validação** automática de DTOs
- 📚 **Documentação Swagger** interativa
- 🎯 **Response DTOs padronizados** para todas as operações
- ⚡ **Paginação automática** em listagens
- 🛡️ **Exception Filter global** para tratamento de erros
- 🔒 **Serialização automática** para ocultar campos sensíveis

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

## � Documentação Interativa (Swagger)

A API possui documentação interativa completa via **Swagger UI**.

### 🌐 Acessando o Swagger

Após iniciar a aplicação, acesse:

```
http://localhost:3000/api/docs
```

O Swagger oferece:

- 📖 **Documentação completa** de todos os endpoints
- 🧪 **Teste interativo** das rotas diretamente no navegador
- 📋 **Schemas** de todas as requisições e respostas
- 🔐 **Autenticação JWT** integrada (clique em "Authorize")
- 📝 **Exemplos** de payloads para cada endpoint

### Como usar o Swagger

1. Acesse `http://localhost:3000/api/docs`
2. Para testar endpoints protegidos:
   - Faça login em `/auth/login` para obter o token
   - Clique no botão **"Authorize"** no topo da página
   - Cole o token JWT (sem "Bearer")
   - Clique em **"Authorize"** e feche o modal
3. Agora você pode testar qualquer endpoint diretamente no Swagger!

## 📡 Endpoints Principais da API

A API segue o padrão REST e está versionada em **v1**. Todos os endpoints começam com `/api/v1`.

> 💡 **Dica**: Para detalhes completos de todos os endpoints, schemas e poder testá-los interativamente, acesse a [Documentação Swagger](#-documentação-interativa-swagger).

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/v1/auth/login` | Fazer login e obter token JWT | Não |
| POST | `/api/v1/users` | Registrar novo usuário | Não |
| PATCH | `/api/v1/auth/password` | Atualizar senha do usuário | Sim |

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/v1/users` | Listar todos os usuários (paginado) | Não |
| GET | `/api/v1/users/:id` | Obter detalhes de um usuário | Não |
| GET | `/api/v1/users/me` | Obter perfil do usuário autenticado | Sim |
| POST | `/api/v1/users` | Registrar novo usuário | Não |
| PATCH | `/api/v1/users/:id` | Atualizar usuário (incluindo papel) | Admin |
| PATCH | `/api/v1/users/me` | Atualizar perfil próprio | Sim |
| DELETE | `/api/v1/users/:id` | Deletar usuário | Admin |

### Filmes

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/v1/movies` | Listar filmes (com filtros e paginação) | Não |
| GET | `/api/v1/movies/:id` | Obter detalhes de um filme | Não |
| POST | `/api/v1/movies` | Adicionar novo filme | Admin |
| PATCH | `/api/v1/movies/:id` | Atualizar filme | Admin |
| DELETE | `/api/v1/movies/:id` | Deletar filme | Admin |
| GET | `/api/v1/movies/:id/actors` | Listar atores de um filme | Não |
| POST | `/api/v1/movies/:id/actors/:actorId` | Adicionar ator ao filme | Admin |
| DELETE | `/api/v1/movies/:id/actors/:actorId` | Remover ator do filme | Admin |
| GET | `/api/v1/movies/:id/directors` | Listar diretores de um filme | Não |
| POST | `/api/v1/movies/:id/directors/:directorId` | Adicionar diretor ao filme | Admin |
| DELETE | `/api/v1/movies/:id/directors/:directorId` | Remover diretor do filme | Admin |
| GET | `/api/v1/movies/:id/genres` | Listar gêneros de um filme | Não |
| POST | `/api/v1/movies/:id/genres/:genreId` | Adicionar gênero ao filme | Admin |
| PATCH | `/api/v1/movies/:id/genres/:genreId` | Atualizar gênero do filme (notas) | Admin |
| DELETE | `/api/v1/movies/:id/genres/:genreId` | Remover gênero do filme | Admin |
| PATCH | `/api/v1/movies/:movieId/actors/:actorId` | Atualizar ator do filme (notas) | Admin |
| PATCH | `/api/v1/movies/:movieId/directors/:directorId` | Atualizar diretor do filme (notas) | Admin |

### Avaliações

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/v1/movies/:movieId/reviews` | Listar avaliações de um filme | Não |
| GET | `/api/v1/reviews/my-reviews` | Listar minhas avaliações | Sim |
| GET | `/api/v1/reviews/:id` | Obter avaliação específica | Não |
| POST | `/api/v1/movies/:movieId/reviews` | Criar nova avaliação | Sim |
| PATCH | `/api/v1/reviews/:id` | Atualizar avaliação própria | Owner/Admin |
| DELETE | `/api/v1/reviews/:id` | Deletar avaliação própria | Owner/Admin |

### Outros Endpoints

- **Atores**: `/api/v1/actors` (GET, POST, PATCH, DELETE)
- **Diretores**: `/api/v1/directors` (GET, POST, PATCH, DELETE)
- **Gêneros**: `/api/v1/genres` (GET, POST, PATCH, DELETE)

### Parâmetros de Query Comuns

```
?page=1              # Página atual (paginação)
?limit=10            # Itens por página
?order=createdAt:DESC # Ordenação (campo:direção)
?include=actor,genre # Incluir relações
?title=Matrix        # Filtro por título (busca parcial)
```

### Campo `notes` nas Relações

Os endpoints de relação entre filmes e atores, diretores e gêneros possuem um campo **`notes`** que permite adicionar notas ou comentários descritivos sobre aquela relação específica. Este campo é útil para:

- **Atores**: Adicionar informações como tipo de papel, nome do personagem, ou observações sobre a performance
- **Diretores**: Adicionar detalhes sobre o papel de direção ou outros comentários relevantes
- **Gêneros**: Adicionar prioridade, relevância ou observações sobre a categorização do filme

#### Exemplo: Adicionar notas ao ator de um filme

**Requisição:**

```bash
curl -X PATCH http://localhost:3000/api/v1/movies/1/actors/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"notes":"Protagonista, interpretou Neo"}'
```

**Resposta:**

```json
{
  "success": true,
  "message": "Recurso atualizado com sucesso",
  "affected": 1
}
```

### Exemplos de Requisição e Resposta

#### Login

**Requisição:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123"}'
```

**Resposta:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Listar filmes com paginação

**Requisição:**

```bash
curl "http://localhost:3000/api/v1/movies?page=1&limit=5&title=matrix&include=actors,genres"
```

**Resposta:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "The Matrix",
      "synopsis": "Um hacker descobre a verdade sobre sua realidade...",
      "releaseDate": "1999-03-31",
      "duration": 136,
      "imagePath": "uploads/movies/matrix.jpg",
      "actors": [
        { "id": 1, "name": "Keanu Reeves" },
        { "id": 2, "name": "Laurence Fishburne" }
      ],
      "genres": [
        { "id": 1, "name": "Ficção Científica" },
        { "id": 2, "name": "Ação" }
      ]
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

#### Criar avaliação

**Requisição:**

```bash
curl -X POST http://localhost:3000/api/v1/movies/1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"stars":5,"comment":"Excelente filme!"}'
```

**Resposta:**

```json
{
  "id": 1,
  "stars": 5,
  "comment": "Excelente filme!",
  "movieId": 1,
  "userId": 1,
  "movie": {
    "id": 1,
    "title": "The Matrix"
  },
  "user": {
    "id": 1,
    "name": "João Silva",
    "username": "joaosilva"
  }
}
```

#### Atualizar filme (resposta padronizada)

**Requisição:**

```bash
curl -X PATCH http://localhost:3000/api/v1/movies/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"title":"Matrix Reloaded"}'
```

**Resposta:**

```json
{
  "success": true,
  "message": "Recurso atualizado com sucesso",
  "affected": 1
}
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro: "Cannot connect to MySQL server"

**Causa**: O container do MySQL ainda não está pronto.

**Solução**:

```bash
# Aguarde alguns segundos e tente novamente
docker-compose logs mysql

# Ou reinicie os containers
docker-compose restart
```

#### Erro: "Port 3000 already in use"

**Causa**: Outra aplicação está usando a porta 3000.

**Solução**:

```bash
# Altere a porta no .env
PORT=3001

# Ou mate o processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

#### Erro: "JWT must be provided"

**Causa**: Token de autenticação não foi enviado ou está inválido.

**Solução**:

1. Faça login em `/api/v1/auth/login` para obter um token válido
2. Inclua o token no header: `Authorization: Bearer SEU_TOKEN`
3. No Swagger, clique em "Authorize" e cole o token

#### Containers não iniciam

**Solução**:

```bash
# Limpe tudo e comece do zero
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

#### Upload de arquivo falha

**Causa**: Diretório de uploads não tem permissão de escrita.

**Solução**:

```bash
# Crie o diretório com permissões corretas
mkdir -p uploads/movies uploads/actors uploads/directors uploads/users
chmod -R 755 uploads/
```

#### Erro de validação em DTOs

**Causa**: Payload enviado não está no formato esperado.

**Solução**:

1. Verifique a documentação Swagger em `/api/docs`
2. Confira os schemas de requisição
3. Certifique-se de enviar todos os campos obrigatórios
4. Valide os tipos de dados (number, string, boolean, etc)

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
