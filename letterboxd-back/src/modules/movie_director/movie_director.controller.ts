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
import { Actor } from '../actor/entities/actor.entity';
import { Movie } from '../movie/entities/movie.entity';
import { MovieDirectorService } from './movie_director.service';

@Controller({ version: '1', path: 'movies' })
export class MovieDirectorController {
  constructor(private readonly movieDirectorService: MovieDirectorService) {}

  @Post(':movieId/directors/:directorId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('directorId', ParseIntPipe) directorId: number,
  ): Promise<Movie> {
    return this.movieDirectorService.create(movieId, directorId);
  }

  @Get(':movieId/directors')
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<Actor[]> {
    return this.movieDirectorService.findAll(movieId);
  }

  @Delete(':movieId/directors/:directorId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('directorId', ParseIntPipe) directorId: number,
  ): Promise<Movie> {
    return this.movieDirectorService.remove(movieId, directorId);
  }
}
