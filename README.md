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

**Em desenvolvimento ativo** - Backend funcional com API REST completa. Frontend em planejamento.

## 🏗️ Arquitetura

O projeto está organizado em módulos:

- **Backend (NestJS)**: API REST com TypeScript, MySQL e Redis
- **Frontend**: Em planejamento (React/Next.js)

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
- **Node.js** >= 18.x (opcional, apenas para desenvolvimento sem Docker)
- **npm** ou **yarn**

## 🚀 Instalando o Letterboxd Clone

### 1. Clone o repositório

```bash
git clone https://github.com/matheusssilva991/letterboxd-clone
cd letterboxd-clone
```

### 2. Configure o Backend

```bash
cd letterboxd-back
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações de banco de dados, Redis, JWT, etc.

### 4. Instale as dependências (se não for usar Docker)

```bash
npm install
```

## ☕ Executando o Projeto

### Com Docker (Recomendado)

O Docker Compose irá subir todos os serviços necessários (MySQL, Redis e a aplicação):

```bash
cd letterboxd-back
docker-compose up -d
```

A aplicação estará disponível em: `http://localhost:3000`

### Sem Docker

Certifique-se de ter o MySQL e Redis rodando localmente, então:

```bash
cd letterboxd-back

# Desenvolvimento com hot-reload
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📚 Documentação da API

Após iniciar o servidor, você pode acessar:

- **API Base**: `http://localhost:3000/api`
- **Endpoints disponíveis**:
  - `/api/auth` - Autenticação e autorização
  - `/api/users` - Gerenciamento de usuários
  - `/api/movies` - Catálogo de filmes
  - `/api/reviews` - Avaliações e críticas
  - `/api/actors` - Atores
  - `/api/directors` - Diretores
  - `/api/genres` - Gêneros

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
├── letterboxd-back/          # Backend NestJS
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
│   ├── docker-compose.yml   # Orquestração de containers
│   └── Dockerfile           # Imagem Docker da aplicação
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
