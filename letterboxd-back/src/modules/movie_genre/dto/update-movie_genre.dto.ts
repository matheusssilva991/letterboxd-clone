import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieGenreDto } from './create-movie_genre.dto';

export class UpdateMovieGenreDto extends PartialType(CreateMovieGenreDto) {}
