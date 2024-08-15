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
import { CreateMovieDirectorDto } from './dto/create-movie_director.dto';
import { UpdateMovieDirectorDto } from './dto/update-movie_director.dto';
import { MovieDirector } from './entities/movie_genre.entity';
import { MovieDirectorService } from './movie_director.service';

@Controller('api')
export class MovieDirectorController {
  constructor(private readonly movieDirectorService: MovieDirectorService) {}

  @Post('movie-director')
  async create(
    @Body() createMovieDirectorDto: CreateMovieDirectorDto,
  ): Promise<MovieDirector> {
    return this.movieDirectorService.create(createMovieDirectorDto);
  }

  @Get('movie-directors')
  async findAll(): Promise<MovieDirector[]> {
    return this.movieDirectorService.findAll();
  }

  @Get('movie-director/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieDirector> {
    return this.movieDirectorService.findOne(+id);
  }

  @Patch('movie-director/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieGenreDto: UpdateMovieDirectorDto,
  ): Promise<UpdateResult> {
    return this.movieDirectorService.update(+id, updateMovieGenreDto);
  }

  @Delete('movie-director/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.movieDirectorService.remove(+id);
  }
}
