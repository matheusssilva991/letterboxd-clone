import { PickType } from '@nestjs/swagger';
import { MoviesQueryDto } from './movies-query.dto';

export class MovieQueryDto extends PickType(MoviesQueryDto, ['include']) {}
