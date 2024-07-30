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
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';

@Controller('api')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('movie')
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  @Get('movies')
  async findAll(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @Get('movie/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.movieService.findOne(+id);
  }

  @Patch('movie/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<UpdateResult> {
    return this.movieService.update(+id, updateMovieDto);
  }

  @Delete('movie/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.movieService.remove(+id);
  }
}
