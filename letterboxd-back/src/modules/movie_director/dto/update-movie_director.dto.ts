import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDirectorDto } from './create-movie_director.dto';

export class UpdateMovieDirectorDto extends PartialType(
  CreateMovieDirectorDto,
) {}
