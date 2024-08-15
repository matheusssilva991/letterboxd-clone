import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateMovieActorDto } from './dto/create-movie_actor.dto';
import { UpdateMovieActorDto } from './dto/update-movie_actor.dto';
import { MovieActor } from './entities/movie_actor.entity';
import { MovieActorService } from './movie_actor.service';

@Controller('api')
export class MovieActorController {
  constructor(private readonly movieActorService: MovieActorService) {}

  @Post('movie-actor')
  async create(
    @Body() createMovieActorDto: CreateMovieActorDto,
  ): Promise<MovieActor> {
    return this.movieActorService.create(createMovieActorDto);
  }

  @Get('movie-actors')
  async findAll(): Promise<MovieActor[]> {
    return this.movieActorService.findAll();
  }

  @Get('movie-actor/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieActor> {
    return this.movieActorService.findOne(+id);
  }

  @Patch('movie-actor/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieActorDto: UpdateMovieActorDto,
  ): Promise<UpdateResult> {
    return this.movieActorService.update(+id, updateMovieActorDto);
  }

  @Delete('movie-actor/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.movieActorService.remove(+id);
  }
}
