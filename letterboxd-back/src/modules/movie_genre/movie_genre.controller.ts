import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Genre } from '../genre/entities/genre.entity';
import { Movie } from '../movie/entities/movie.entity';
import { MovieGenreService } from './movie_genre.service';

@Controller({ version: '1', path: 'movies' })
export class MovieGenreController {
  constructor(private readonly movieGenreService: MovieGenreService) {}

  @Post(':movieId/genres/:genreId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('genreId', ParseIntPipe) genreId: number,
  ): Promise<Movie> {
    return this.movieGenreService.create(movieId, genreId);
  }

  @Get(':movieId/genres')
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<Genre[]> {
    return this.movieGenreService.findAll(movieId);
  }

  @Delete(':movieId/genres/:genreId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('genreId', ParseIntPipe) genreId: number,
  ): Promise<Movie> {
    return this.movieGenreService.remove(movieId, genreId);
  }
}
