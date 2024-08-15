import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieActorDto } from './create-movie_actor.dto';

export class UpdateMovieActorDto extends PartialType(CreateMovieActorDto) {}
