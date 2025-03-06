import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieReviewDto } from './create-movie_review.dto';

export class UpdateMovieReviewDto extends PartialType(CreateMovieReviewDto) {}
