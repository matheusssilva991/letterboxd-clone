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
import { MovieActorService } from './movie_actor.service';

@Controller({ version: '1', path: 'movies' })
export class MovieActorController {
  constructor(private readonly movieActorService: MovieActorService) {}

  @Post(':movieId/actors/:actorId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
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
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<Movie> {
    return this.movieActorService.remove(movieId, actorId);
  }
}
