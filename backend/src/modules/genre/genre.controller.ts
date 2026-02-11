import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResponseDto } from '../../common/dto/success-response.dto';
import { UpdateResponseDto } from '../../common/dto/success-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';
import { GenreService } from './genre.service';

@ApiTags('genres')
@Controller({ version: '1', path: 'genres' })
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo gênero' })
  @ApiResponse({ status: 201, description: 'Gênero criado com sucesso', type: Genre })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  async create(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos os gêneros com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de gêneros recuperada com sucesso', type: PaginatedResponseDto<Genre> })
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<Genre>> {
    const { page, limit, skip, take } = pagination;
    const [data, total] = await this.genreService.findAll(skip, take);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um gênero específico por ID' })
  @ApiResponse({ status: 200, description: 'Gênero recuperado com sucesso', type: Genre })
  @ApiResponse({ status: 404, description: 'Gênero não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Genre> {
    return this.genreService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um gênero' })
  @ApiResponse({ status: 200, description: 'Gênero atualizado com sucesso', type: UpdateResponseDto })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Gênero não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<UpdateResponseDto> {
    const result = await this.genreService.update(+id, updateGenreDto);
    return new UpdateResponseDto(result.affected);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar um gênero' })
  @ApiResponse({ status: 200, description: 'Gênero deletado com sucesso', type: DeleteResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Gênero não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponseDto> {
    const result = await this.genreService.remove(+id);
    return new DeleteResponseDto(result.affected);
  }
}
