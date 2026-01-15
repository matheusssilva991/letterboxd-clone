import { PickType } from '@nestjs/swagger';
import { DirectorsQueryDto } from './directors-query.dto';

export class DirectorQueryDto extends PickType(DirectorsQueryDto, [
  'include',
]) {}
