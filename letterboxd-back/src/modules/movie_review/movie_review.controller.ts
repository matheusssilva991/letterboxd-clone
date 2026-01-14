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
import { MovieReview } from './entities/movie_review.entity';
import { MovieReviewService } from './movie_review.service';
import { UpdateMovieReviewDto } from './dto/update-movie_review.dto';

@ApiTags('reviews')
@Controller({ version: '1' })
export class MovieReviewController {
  constructor(private readonly movieReviewService: MovieReviewService) {}

  @Post('movies/:movieId/reviews')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createMovieReviewDto: CreateMovieReviewDto,
    @Req() req: Request,
  ): Promise<ReviewResponseDto> {
    const user = req.user as User;
    const userId = user.id;
    const review = await this.movieReviewService.create(
      movieId,
      userId,
      createMovieReviewDto,
    );
    return new ReviewResponseDto(review);
  }

  @Get('movies/:movieId/reviews')
  async findAll(
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

  @Get('reviews/my-reviews')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAllByUser(
    @Req() req: Request,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<ReviewResponseDto>> {
    const user = req.user as User;
    const userId = user.id;
    const { page, limit, skip, take } = pagination;
    const [data, total] = await this.movieReviewService.findAllByUser(
      userId,
      skip,
      take,
    );
    const reviews = data.map((review) => new ReviewResponseDto(review));

    return new PaginatedResponseDto(reviews, total, page, limit);
  }

  @Get('reviews/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReviewResponseDto> {
    const review = await this.movieReviewService.findOne(id);
    return new ReviewResponseDto(review);
  }

  @Patch('reviews/:id')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieReviewDto: UpdateMovieReviewDto,
    @Req() req: Request,
  ): Promise<UpdateResponseDto> {
    const user = req.user as User;
    const userId = user.id;
    const movieReview = await this.movieReviewService.findOne(id);

    if (movieReview.userId !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para deletar essa crítica.',
      );
    }

    const result = await this.movieReviewService.update(id, updateMovieReviewDto);
    return new UpdateResponseDto(result.affected);
  }

  @Delete('reviews/:id')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<DeleteResponseDto> {
    const user = req.user as User;
    const userId = user.id;
    const movieReview = await this.movieReviewService.findOne(id);

    if (movieReview.userId !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para deletar essa crítica.',
      );
    }
    const result = await this.movieReviewService.remove(id);
    return new DeleteResponseDto(result.affected);
  }
}
