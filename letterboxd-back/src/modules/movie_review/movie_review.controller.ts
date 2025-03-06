import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateMovieReviewDto } from './dto/create-movie_review.dto';
import { MovieReview } from './entities/movie_actor.entity';
import { MovieReviewService } from './movie_review.service';

@Controller({ version: '1' })
export class MovieReviewController {
  constructor(private readonly movieReviewService: MovieReviewService) {}

  @Post('movies/:movieId/reviews')
  async create(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createMovieActorDto: CreateMovieReviewDto,
  ): Promise<MovieReview> {
    return this.movieReviewService.create(movieId, createMovieActorDto);
  }

  @Get('/movies/:movieId/reviews')
  async findAll(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<MovieReview[]> {
    return this.movieReviewService.findAll(movieId);
  }

  // Todo: O id do usuário será passado via token na requisição
  @Get(':movieId/reviews/my-reviews/:userId')
  async findAllByUser(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<MovieReview[]> {
    return this.movieReviewService.findAllByUser(movieId, userId);
  }

  @Get('reviews/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieReview> {
    return this.movieReviewService.findOne(id);
  }

  @Delete('reviews/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.movieReviewService.remove(id);
  }
}
