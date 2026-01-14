/**
 * Arquivo principal da aplicação - Bootstrap do NestJS
 *
 * Este arquivo é responsável por:
 * - Inicializar a aplicação NestJS
 * - Configurar pipes globais de validação
 * - Habilitar versionamento de API
 * - Definir prefixo global das rotas
 * - Iniciar o servidor HTTP
 */

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Função de inicialização da aplicação
 * Configura e inicia o servidor NestJS com todas as configurações necessárias
 */
async function bootstrap() {
  // Obtém a porta da variável de ambiente ou usa 3000 como padrão
  const port = process.env.PORT || 3000;

  // Cria a instância da aplicação NestJS a partir do módulo raiz
  const app = await NestFactory.create(AppModule);

  // Configura o pipe global de validação para validar automaticamente todos os DTOs
  // transform: false - Não transforma os payloads automaticamente
  app.useGlobalPipes(new ValidationPipe({ transform: false }));

  // Habilita o versionamento de API através da URI (ex: /api/v1/users)
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Define 'api' como prefixo global para todas as rotas
  // Exemplo: /users se torna /api/users
  app.setGlobalPrefix('api');

  // Configuração do Swagger para documentação da API
  const config = new DocumentBuilder()
    .setTitle('Letterboxd Clone API')
    .setDescription('API para clone do Letterboxd - Plataforma de reviews de filmes')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('movies', 'Gerenciamento de filmes')
    .addTag('actors', 'Gerenciamento de atores')
    .addTag('directors', 'Gerenciamento de diretores')
    .addTag('genres', 'Gerenciamento de gêneros')
    .addTag('reviews', 'Avaliações de filmes')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Letterboxd Clone API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Inicia o servidor HTTP na porta especificada
  await app.listen(port);

  console.log(`🚀 Aplicação rodando em: http://localhost:${port}/api`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
}

// Executa a função de bootstrap
bootstrap();
