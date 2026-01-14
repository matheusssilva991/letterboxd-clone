import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { DeleteResult, UpdateResult } from 'typeorm';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { User } from '../user/entities/user.entity';
import { CreateMovieReviewDto } from './dto/create-movie_review.dto';
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
  ): Promise<MovieReview> {
    const user = req.user as User;
    const userId = user.id;
    return this.movieReviewService.create(
      movieId,
      userId,
      createMovieReviewDto,
    );
  }

  @Get('movies/:movieId/reviews')
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<MovieReview[]> {
    return this.movieReviewService.findAll(movieId);
  }

  @Get('reviews/my-reviews')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAllByUser(@Req() req: Request): Promise<MovieReview[]> {
    const user = req.user as User;
    const userId = user.id;
    return this.movieReviewService.findAllByUser(userId);
  }

  @Get('reviews/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovieReview> {
    return this.movieReviewService.findOne(id);
  }

  @Patch('reviews/:id')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieReviewDto: UpdateMovieReviewDto,
    @Req() req: Request,
  ): Promise<UpdateResult> {
    const user = req.user as User;
    const userId = user.id;
    const movieReview = await this.movieReviewService.findOne(id);

    if (movieReview.userId !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para deletar essa crítica.',
      );
    }

    return this.movieReviewService.update(id, updateMovieReviewDto);
  }

  @Delete('reviews/:id')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<DeleteResult> {
    const user = req.user as User;
    const userId = user.id;
    const movieReview = await this.movieReviewService.findOne(id);

    if (movieReview.userId !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para deletar essa crítica.',
      );
    }
    return this.movieReviewService.remove(id);
  }
}
