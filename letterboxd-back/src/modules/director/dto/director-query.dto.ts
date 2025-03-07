import { PickType } from '@nestjs/mapped-types';
import { DirectorsQueryDto } from './directors-query.dto';

export class DirectorQueryDto extends PickType(DirectorsQueryDto, [
  'include',
]) {}
