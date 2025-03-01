# Letterboxd Clone - Backend

Este é o repositório do backend para o projeto de replicação do site Letterboxd. Ele foi desenvolvido utilizando **NestJS**, com **MySQL** como banco de dados, **Redis** para cache e executado em contêineres via **Docker** e **Docker Compose**.

## Tecnologias Utilizadas

- **NestJS** - Framework para Node.js
- **MySQL** - Banco de dados relacional
- **Redis** - Cache para melhoria de performance
- **Docker** - Contêinerização do backend
- **Docker Compose** - Orquestração dos contêineres

## Requisitos

Antes de iniciar, certifique-se de ter instalado:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (caso queira rodar sem Docker)

## Instalação e Execução

### Com Docker (Recomendado)

1. Clone o repositório:

   ```sh
   git clone https://github.com/matheusssilva991/letterboxd-clone
   cd letterboxd-back
   ```

2. Copie o arquivo `.env.example` para `.env`:

   ```sh
   cp .env.example .env
   ```

3. Configure as variáveis de ambiente no arquivo `.env`.

4. Suba os contêineres com o Docker Compose:

   ```sh
   docker-compose up -d
   ```

5. O backend estará rodando em: `http://localhost:3000`

### Sem Docker

1. Instale as dependências:

   ```sh
   npm install
   ```

2. Copie o arquivo `.env.example` para `.env`:

   ```sh
   cp .env.example .env
   ```

3. Configure as variáveis de ambiente no arquivo `.env`.

4. Inicie o servidor:

   ```sh
   npm run start
   ```

## Estrutura do Projeto

```files
letterboxd-clone-backend/
├── dist/               # Arquivos compilados
├── node_modules/       # Dependências do projeto
├── config/             # Configurações do projeto
├── dev_files/          # Arquivos de desenvolvimento
├── src/
│   ├── modules/        # Módulos do NestJS
│   ├── common/         # Módulos comuns
│   ├── main.ts         # Arquivo principal do app
|   ├── app.module.ts   # Módulo principal
├── docker-compose.yml  # Configuração dos contêineres
├── Dockerfile          # Configuração do backend no Docker
├── .env.example        # Exemplo de variáveis de ambiente
└── README.md
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` e configure as seguintes variáveis:

```env
NODE_ENV='development'
PORT='3000'

MYSQL_HOST='localhost'
MYSQL_PORT='3306'
MYSQL_USERNAME='root'
MYSQL_PASSWORD='password'
MYSQL_DATABASE='letterboxd'

REDIS_HOST='localhost'
REDIS_PORT='6379'

CACHE_TTL='5000'
CACHE_MAX='100
```

## Endpoints Principais

- `GET /movies` - Lista todos os filmes
- `POST /movies` - Adiciona um novo filme
- `GET /users/:id` - Retorna informações do usuário
- `POST /auth/login` - Autentica um usuário

## Testes

Para rodar os testes unitários:

```sh
npm run test
```

Para rodar os testes e2e:

```sh
npm run test:e2e
```

## Contribuição

1. Fork este repositório
2. Crie uma branch (`git checkout -b minha-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça o push da branch (`git push origin minha-feature`)
5. Abra um Pull Request

---

Se precisar de algo mais específico, é só avisar! 🚀
