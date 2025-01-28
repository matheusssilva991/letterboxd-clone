import {
  CacheInterceptor,
  CacheModule,
  CacheModuleAsyncOptions,
} from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingMiddleware } from './common/middlewares/logging.midleware';
import { ActorModule } from './modules/actor/actor.module';
import { DirectorModule } from './modules/director/director.module';
import { GenreModule } from './modules/genre/genre.module';
import { MovieModule } from './modules/movie/movie.module';
import { MovieActorModule } from './modules/movie_actor/movie_actor.module';
import { MovieDirectorModule } from './modules/movie_director/movie_director.module';
import { MovieGenreModule } from './modules/movie_genre/movie_genre.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        ttl: configService.get('CACHE_TTL', 5000),
        max: configService.get('CACHE_MAX', 10),
      }),
      isGlobal: true,
    }),
    GenreModule,
    ActorModule,
    MovieModule,
    MovieActorModule,
    MovieDirectorModule,
    MovieGenreModule,
    DirectorModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
