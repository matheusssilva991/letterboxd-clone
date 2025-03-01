import {
  CacheInterceptor,
  CacheModule,
  CacheModuleAsyncOptions,
} from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cacheConfig } from '../config/cache.config';
import { throttlerConfig } from '../config/throttler.config';
import { typeOrmConfig } from '../config/typeorm.config';
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
    TypeOrmModule.forRootAsync(typeOrmConfig),
    CacheModule.registerAsync<CacheModuleAsyncOptions>(cacheConfig),
    ThrottlerModule.forRootAsync(throttlerConfig),
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
