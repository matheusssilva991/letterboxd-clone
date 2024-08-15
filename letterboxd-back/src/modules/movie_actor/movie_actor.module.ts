import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorModule } from '../actor/actor.module';
import { MovieModule } from '../movie/movie.module';
import { MovieActor } from './entities/movie_actor.entity';
import { MovieActorController } from './movie_actor.controller';
import { MovieActorService } from './movie_actor.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieActor]), MovieModule, ActorModule],
  controllers: [MovieActorController],
  providers: [MovieActorService],
  exports: [MovieActorService],
})
export class MovieActorModule {}
