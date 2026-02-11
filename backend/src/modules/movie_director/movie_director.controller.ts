import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { Director } from '../director/entities/director.entity';
import { Movie } from '../movie/entities/movie.entity';
import { MovieDirectorService } from './movie_director.service';

@ApiTags('movies')
@Controller({ version: '1', path: 'movies' })
export class MovieDirectorController {
  constructor(private readonly movieDirectorService: MovieDirectorService) {}

  @Post(':movieId/directors/:directorId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar um diretor ao filme' })
  @ApiResponse({ status: 201, description: 'Diretor adicionado ao filme com sucesso', type: Movie })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Filme ou diretor não encontrado' })
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('directorId', ParseIntPipe) directorId: number,
  ): Promise<Movie> {
    return this.movieDirectorService.create(movieId, directorId);
  }

  @Get(':movieId/directors')
  @ApiOperation({ summary: 'Buscar todos os diretores de um filme específico' })
  @ApiResponse({ status: 200, description: 'Lista de diretores recuperada com sucesso', type: [Director] })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<Director[]> {
    return this.movieDirectorService.findAll(movieId);
  }

  @Delete(':movieId/directors/:directorId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um diretor do filme' })
  @ApiResponse({ status: 200, description: 'Diretor removido do filme com sucesso', type: Movie })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Filme ou diretor não encontrado' })
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('directorId', ParseIntPipe) directorId: number,
  ): Promise<Movie> {
    return this.movieDirectorService.remove(movieId, directorId);
  }
}
