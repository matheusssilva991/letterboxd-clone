import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Actor } from '../actor/entities/actor.entity';
import { Movie } from '../movie/entities/movie.entity';
import { MovieActorService } from './movie_actor.service';
import { UpdateMovieActorDto } from './dto/update-movie_actor.dto';
import { UpdateResponseDto } from '../../common/dto/success-response.dto';

@ApiTags('movies')
@Controller({ version: '1', path: 'movies' })
export class MovieActorController {
  constructor(private readonly movieActorService: MovieActorService) {}

  @Post(':movieId/actors/:actorId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar um ator ao filme' })
  @ApiResponse({ status: 201, description: 'Ator adicionado ao filme com sucesso', type: Movie })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Filme ou ator não encontrado' })
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<Movie> {
    return this.movieActorService.create(movieId, actorId);
  }

  @Get(':movieId/actors')
  @ApiOperation({ summary: 'Buscar todos os atores de um filme específico' })
  @ApiResponse({ status: 200, description: 'Lista de atores recuperada com sucesso', type: [Actor] })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<Actor[]> {
    return this.movieActorService.findAll(movieId);
  }

  @Patch(':movieId/actors/:actorId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar informações da relação entre ator e filme' })
  @ApiResponse({ status: 200, description: 'Relação ator-filme atualizada com sucesso', type: UpdateResponseDto })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Filme ou ator não encontrado' })
  async update(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
    @Body() updateMovieActorDto: UpdateMovieActorDto,
  ): Promise<UpdateResponseDto> {
    const affected = await this.movieActorService.update(
      movieId,
      actorId,
      updateMovieActorDto,
    );
    return new UpdateResponseDto(affected);
  }

  @Delete(':movieId/actors/:actorId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um ator do filme' })
  @ApiResponse({ status: 200, description: 'Ator removido do filme com sucesso', type: Movie })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Filme ou ator não encontrado' })
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<Movie> {
    return this.movieActorService.remove(movieId, actorId);
  }
}
