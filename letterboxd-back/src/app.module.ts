/**
 * Módulo raiz da aplicação
 *
 * Responsável por:
 * - Importar e configurar todos os módulos da aplicação
 * - Configurar serviços globais (Cache, Throttler, TypeORM)
 * - Registrar providers globais (interceptors, guards)
 * - Aplicar middlewares globais
 */

import {
  CacheInterceptor,
  CacheModule,
  CacheModuleAsyncOptions,
} from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cacheConfig } from '../config/cache.config';
import { throttlerConfig } from '../config/throttler.config';
import { typeOrmConfig } from '../config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingMiddleware } from './common/middlewares/logging.midleware';
import { ActorModule } from './modules/actor/actor.module';
import { AuthModule } from './modules/auth/auth.module';
import { DirectorModule } from './modules/director/director.module';
import { FileModule } from './modules/file/file.module';
import { GenreModule } from './modules/genre/genre.module';
import { MovieModule } from './modules/movie/movie.module';
import { MovieActorModule } from './modules/movie_actor/movie_actor.module';
import { MovieDirectorModule } from './modules/movie_director/movie_director.module';
import { MovieGenreModule } from './modules/movie_genre/movie_genre.module';
import { MovieReviewModule } from './modules/movie_review/movie_review.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    // Configuração global de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true, // Disponibiliza o ConfigService em toda a aplicação
      envFilePath: '.env', // Caminho do arquivo de configuração
    }),

    // Configuração do TypeORM (banco de dados MySQL)
    TypeOrmModule.forRootAsync(typeOrmConfig),

    // Configuração do sistema de cache com Redis
    CacheModule.registerAsync<CacheModuleAsyncOptions>(cacheConfig),

    // Configuração do rate limiting (throttler) para prevenir abuso de API
    ThrottlerModule.forRootAsync(throttlerConfig),

    // Módulos de domínio da aplicação
    GenreModule,          // Gerenciamento de gêneros cinematográficos
    ActorModule,          // Gerenciamento de atores
    MovieModule,          // Gerenciamento de filmes
    MovieActorModule,     // Relação muitos-para-muitos entre filmes e atores
    MovieDirectorModule,  // Relação muitos-para-muitos entre filmes e diretores
    MovieGenreModule,     // Relação muitos-para-muitos entre filmes e gêneros
    MovieReviewModule,    // Sistema de avaliações de filmes
    DirectorModule,       // Gerenciamento de diretores
    UserModule,           // Gerenciamento de usuários
    FileModule,           // Upload e gerenciamento de arquivos
    AuthModule,           // Autenticação e autorização JWT
  ],
  controllers: [AppController], // Controller raiz da aplicação
  providers: [
    AppService, // Service raiz da aplicação
    {
      // Interceptor global de cache - aplica cache automaticamente onde configurado
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      // Guard global de throttling - limita número de requisições por período
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AppService], // Exporta AppService para uso em outros módulos
})
export class AppModule implements NestModule {
  /**
   * Configura middlewares globais da aplicação
   * @param consumer - Consumer de middlewares do NestJS
   */
  configure(consumer: MiddlewareConsumer) {
    // Aplica o middleware de logging para todas as rotas
    // Registra informações sobre cada requisição HTTP
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
