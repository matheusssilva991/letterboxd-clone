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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { multerConfig } from '../../../config/multer.config';
import {
  DeleteResponseDto,
  UpdateResponseDto,
} from '../../common/dto/success-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { FileService } from '../file/file.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';
import { MoviesQueryDto } from './dto/movies-query.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';

@ApiTags('movies')
@Controller({ version: '1', path: 'movies' })
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig('movies')))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo filme' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Filme criado com sucesso', type: Movie })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - Apenas ADMIN' })
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<Movie> {
    if (image) {
      createMovieDto.imagePath = image.path;
    }

    try {
      return await this.movieService.create(createMovieDto);
    } catch (error) {
      this.fileService.deleteImage(image.path);

      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os filmes' })
  @ApiResponse({ status: 200, description: 'Lista paginada de filmes' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query() query: MoviesQueryDto,
  ): Promise<PaginatedResponseDto<Movie>> {
    const { page, limit, skip, take } = pagination;
    const [data, total] = await this.movieService.findAll(query, skip, take);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar filme por ID' })
  @ApiResponse({ status: 200, description: 'Filme encontrado', type: Movie })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: MovieQueryDto,
  ): Promise<Movie> {
    return this.movieService.findOne(+id, query);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig('movies')))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar filme' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Filme atualizado com sucesso',
    type: UpdateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<UpdateResponseDto> {
    if (image) {
      updateMovieDto.imagePath = image.path;
    }
    const result = await this.movieService.update(+id, updateMovieDto);
    return new UpdateResponseDto(result.affected);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deletar filme' })
  @ApiResponse({
    status: 200,
    description: 'Filme deletado com sucesso',
    type: DeleteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponseDto> {
    const result = await this.movieService.remove(+id);
    return new DeleteResponseDto(result.affected);
  }
}
