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
import { CreateMovieGenreDto } from './dto/create-movie_genre.dto';
import { UpdateMovieGenreDto } from './dto/update-movie_genre.dto';
import { MovieGenre } from './entities/movie_genre.entity';
import { MovieGenreService } from './movie_genre.service';

@Controller({ version: '1', path: 'movie-genres' })
export class MovieGenreController {
  constructor(private readonly movieGenreService: MovieGenreService) {}

  @Post()
  async create(
    @Body() createMovieGenreDto: CreateMovieGenreDto,
  ): Promise<MovieGenre> {
    return this.movieGenreService.create(createMovieGenreDto);
  }

  @Get()
  async findAll(): Promise<MovieGenre[]> {
    return this.movieGenreService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieGenre> {
    return this.movieGenreService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieGenreDto: UpdateMovieGenreDto,
  ): Promise<UpdateResult> {
    return this.movieGenreService.update(+id, updateMovieGenreDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.movieGenreService.remove(+id);
  }
}
