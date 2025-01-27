import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateMovieActorDto } from './dto/create-movie_actor.dto';
import { MovieActor } from './entities/movie_actor.entity';
import { MovieActorService } from './movie_actor.service';

@Controller({ version: '1', path: 'movies' })
export class MovieActorController {
  constructor(private readonly movieActorService: MovieActorService) {}

  @Post(':movieId/actors')
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createMovieActorDto: CreateMovieActorDto,
  ): Promise<MovieActor> {
    return this.movieActorService.create(movieId, createMovieActorDto);
  }

  @Get(':movieId/actors')
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<MovieActor[]> {
    return this.movieActorService.findAll(movieId);
  }

  @Get(':movieId/actors/:actorId')
  async findOne(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<MovieActor> {
    return this.movieActorService.findOne(movieId, actorId);
  }

  @Delete(':movieId/actors/:actorId')
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<DeleteResult> {
    return this.movieActorService.remove(movieId, actorId);
  }
}
