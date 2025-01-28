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
import { CreateMovieGenreDto } from './dto/create-movie_genre.dto';
import { MovieGenre } from './entities/movie_genre.entity';
import { MovieGenreService } from './movie_genre.service';

@Controller({ version: '1', path: 'movies' })
export class MovieGenreController {
  constructor(private readonly movieGenreService: MovieGenreService) {}

  @Post(':movieId/genres')
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createMovieGenreDto: CreateMovieGenreDto,
  ): Promise<MovieGenre> {
    return this.movieGenreService.create(movieId, createMovieGenreDto);
  }

  @Get(':movieId/genres')
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<MovieGenre[]> {
    return this.movieGenreService.findAll(movieId);
  }

  @Get(':movieId/genres/:genreId')
  async findOne(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('genreId', ParseIntPipe) genreId: number,
  ): Promise<MovieGenre> {
    return this.movieGenreService.findOne(movieId, genreId);
  }

  @Delete(':movieId/genres/:genreId')
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('genreId', ParseIntPipe) genreId: number,
  ): Promise<DeleteResult> {
    return this.movieGenreService.remove(movieId, genreId);
  }
}
