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
import { CreateMovieDirectorDto } from './dto/create-movie_director.dto';
import { MovieDirector } from './entities/movie_director.entity';
import { MovieDirectorService } from './movie_director.service';

@Controller({ version: '1', path: 'movies' })
export class MovieDirectorController {
  constructor(private readonly movieDirectorService: MovieDirectorService) {}

  @Post(':movieId/directors')
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createMovieDirectorDto: CreateMovieDirectorDto,
  ): Promise<MovieDirector> {
    return this.movieDirectorService.create(movieId, createMovieDirectorDto);
  }

  @Get(':movieId/directors')
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<MovieDirector[]> {
    return this.movieDirectorService.findAll(movieId);
  }

  @Get(':movieId/directors/:directorId')
  async findOne(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('directorId', ParseIntPipe) directorId: number,
  ): Promise<MovieDirector> {
    return this.movieDirectorService.findOne(movieId, directorId);
  }

  @Delete(':movieId/directors/:directorId')
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('directorId', ParseIntPipe) directorId: number,
  ): Promise<DeleteResult> {
    return this.movieDirectorService.remove(movieId, directorId);
  }
}
