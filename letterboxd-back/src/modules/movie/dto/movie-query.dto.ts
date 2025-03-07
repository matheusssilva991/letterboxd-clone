import { PickType } from '@nestjs/mapped-types';
import { MoviesQueryDto } from './movies-query.dto';

export class MovieQueryDto extends PickType(MoviesQueryDto, ['include']) {}
