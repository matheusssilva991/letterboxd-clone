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
  Req,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { DeleteResponseDto } from '../../common/dto/success-response.dto';
import { UpdateResponseDto } from '../../common/dto/success-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { User } from '../user/entities/user.entity';
import { CreateMovieReviewDto } from './dto/create-movie_review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { MovieReviewService } from './movie_review.service';
import { UpdateMovieReviewDto } from './dto/update-movie_review.dto';
import { MovieReviewQueryDto } from './dto/queries-movie_review.dto';

@ApiTags('reviews')
@Controller({ version: '1', path: 'reviews' })
export class MovieReviewController {
  constructor(private readonly movieReviewService: MovieReviewService) {}

  @Post()
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma avaliação para um filme' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso', type: ReviewResponseDto })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async create(
    @Body() createMovieReviewDto: CreateMovieReviewDto,
    @Req() req: Request,
  ): Promise<ReviewResponseDto> {
    const user = req.user as User;
    const userId = user.id;
    const movieId = createMovieReviewDto.movieId;
    const review = await this.movieReviewService.create(
      movieId,
      userId,
      createMovieReviewDto,
    );
    return new ReviewResponseDto(review);
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar avaliações - por filme (query param) ou do usuário autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações recuperada com sucesso',
    type: PaginatedResponseDto<ReviewResponseDto>
  })
  @ApiResponse({ status: 401, description: 'Não autorizado (apenas se sem movieId)' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async findAll(
    @Query() query: MovieReviewQueryDto,
    @Req() req: Request,
  ): Promise<PaginatedResponseDto<ReviewResponseDto>> {
    const { page, limit, skip, take, movieId } = query;

    // Se movieId for fornecido, retorna reviews do filme (público, sem guard)
    if (movieId) {
      const [data, total] = await this.movieReviewService.findAll(
        movieId,
        skip,
        take,
      );
      const reviews = data.map((review) => new ReviewResponseDto(review));
      return new PaginatedResponseDto(reviews, total, page, limit);
    }

    // Senão, retorna reviews do usuário autenticado (requer autenticação)
    // Aplica guard manualmente aqui para rota condicional
    if (!req.user) {
      throw new UnauthorizedException(
        'Para listar seus reviews, autentique-se. Ou use query param ?movieId=X para listar reviews de um filme.',
      );
    }

    const user = req.user as User;
    const userId = user.id;
    const [data, total] = await this.movieReviewService.findAllByUser(
      userId,
      skip,
      take,
    );
    const reviews = data.map((review) => new ReviewResponseDto(review));
    return new PaginatedResponseDto(reviews, total, page, limit);
  }

  @Get('by-movie/:movieId')
  @ApiOperation({
    summary: 'DEPRECATED - Use GET / com query param ?movieId=:movieId para buscar reviews de um filme'
  })
  @ApiResponse({ status: 200, description: 'Lista de avaliações recuperada com sucesso', type: PaginatedResponseDto<ReviewResponseDto> })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async findByMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<ReviewResponseDto>> {
    const { page, limit, skip, take } = pagination;
    const [data, total] = await this.movieReviewService.findAll(
      movieId,
      skip,
      take,
    );
    const reviews = data.map((review) => new ReviewResponseDto(review));

    return new PaginatedResponseDto(reviews, total, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma avaliação específica por ID' })
  @ApiResponse({ status: 200, description: 'Avaliação recuperada com sucesso', type: ReviewResponseDto })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReviewResponseDto> {
    const review = await this.movieReviewService.findOne(id);
    return new ReviewResponseDto(review);
  }

  @Patch(':id')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma avaliação (apenas proprietário ou admin)' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada com sucesso', type: UpdateResponseDto })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Não é o proprietário da avaliação' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieReviewDto: UpdateMovieReviewDto,
    @Req() req: Request,
  ): Promise<UpdateResponseDto> {
    const user = req.user as User;
    const movieReview = await this.movieReviewService.findOne(id);

    // Verifica permissão usando método privado
    this.checkOwnership(user, movieReview);

    const result = await this.movieReviewService.update(id, updateMovieReviewDto);
    return new UpdateResponseDto(result.affected);
  }

  @Delete(':id')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar uma avaliação (apenas proprietário ou admin)' })
  @ApiResponse({ status: 200, description: 'Avaliação deletada com sucesso', type: DeleteResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Não é o proprietário da avaliação' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<DeleteResponseDto> {
    const user = req.user as User;
    const movieReview = await this.movieReviewService.findOne(id);

    // Verifica permissão usando método privado
    this.checkOwnership(user, movieReview);

    const result = await this.movieReviewService.remove(id);
    return new DeleteResponseDto(result.affected);
  }

  /**
   * Método privado para verificar se o usuário é o proprietário do recurso
   * Administradores têm permissão automática
   *
   * @param user - Usuário autenticado
   * @param resource - Recurso a ser verificado (deve ter userId)
   * @throws UnauthorizedException se o usuário não for o proprietário
   */
  private checkOwnership(user: User, resource: { userId: number }): void {
    // Administradores têm acesso total
    if (user.role === RoleEnum.ADMIN) {
      return;
    }

    // Verifica se o usuário é o proprietário
    if (resource.userId !== user.id) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar/modificar este recurso',
      );
    }
  }
}
