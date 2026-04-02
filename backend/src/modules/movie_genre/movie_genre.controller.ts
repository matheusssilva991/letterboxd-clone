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
import { Genre } from '../genre/entities/genre.entity';
import { Movie } from '../movie/entities/movie.entity';
import { MovieGenreService } from './movie_genre.service';
import { UpdateMovieGenreDto } from './dto/update-movie_genre.dto';
import { UpdateResponseDto } from '../../common/dto/success-response.dto';

@ApiTags('movies')
@Controller({ version: '1', path: 'movies' })
export class MovieGenreController {
  constructor(private readonly movieGenreService: MovieGenreService) {}

  @Post(':movieId/genres/:genreId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar um gênero ao filme' })
  @ApiResponse({ status: 201, description: 'Gênero adicionado ao filme com sucesso', type: Movie })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Filme ou gênero não encontrado' })
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('genreId', ParseIntPipe) genreId: number,
  ): Promise<Movie> {
    return this.movieGenreService.create(movieId, genreId);
  }

  @Get(':movieId/genres')
  @ApiOperation({ summary: 'Buscar todos os gêneros de um filme específico' })
  @ApiResponse({ status: 200, description: 'Lista de gêneros recuperada com sucesso', type: [Genre] })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<Genre[]> {
    return this.movieGenreService.findAll(movieId);
  }

  @Patch(':movieId/genres/:genreId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar informações da relação entre gênero e filme' })
  @ApiResponse({ status: 200, description: 'Relação gênero-filme atualizada com sucesso', type: UpdateResponseDto })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Filme ou gênero não encontrado' })
  async update(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('genreId', ParseIntPipe) genreId: number,
    @Body() updateMovieGenreDto: UpdateMovieGenreDto,
  ): Promise<UpdateResponseDto> {
    const affected = await this.movieGenreService.update(
      movieId,
      genreId,
      updateMovieGenreDto,
    );
    return new UpdateResponseDto(affected);
  }

  @Delete(':movieId/genres/:genreId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um gênero do filme' })
  @ApiResponse({ status: 200, description: 'Gênero removido do filme com sucesso', type: Movie })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Filme ou gênero não encontrado' })
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('genreId', ParseIntPipe) genreId: number,
  ): Promise<Movie> {
    return this.movieGenreService.remove(movieId, genreId);
  }
}
