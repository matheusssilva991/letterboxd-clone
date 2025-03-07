import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorModule } from '../actor/actor.module';
import { Movie } from '../movie/entities/movie.entity';
import { MovieModule } from '../movie/movie.module';
import { MovieActorController } from './movie_actor.controller';
import { MovieActorService } from './movie_actor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), MovieModule, ActorModule],
  controllers: [MovieActorController],
  providers: [MovieActorService],
  exports: [MovieActorService],
})
export class MovieActorModule {}
