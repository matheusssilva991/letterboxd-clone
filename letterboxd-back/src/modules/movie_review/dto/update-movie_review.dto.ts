import { PartialType } from '@nestjs/swagger';
import { CreateMovieReviewDto } from './create-movie_review.dto';

export class UpdateMovieReviewDto extends PartialType(CreateMovieReviewDto) {}
