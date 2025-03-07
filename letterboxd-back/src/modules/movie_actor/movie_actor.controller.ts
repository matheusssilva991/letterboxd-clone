import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Actor } from '../actor/entities/actor.entity';
import { Movie } from '../movie/entities/movie.entity';
import { MovieActorService } from './movie_actor.service';

@Controller({ version: '1', path: 'movies' })
export class MovieActorController {
  constructor(private readonly movieActorService: MovieActorService) {}

  @Post(':movieId/actors/:actorId')
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<Movie> {
    return this.movieActorService.create(movieId, actorId);
  }

  @Get(':movieId/actors')
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<Actor[]> {
    return this.movieActorService.findAll(movieId);
  }

  @Delete(':movieId/actors/:actorId')
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<Movie> {
    return this.movieActorService.remove(movieId, actorId);
  }
}
