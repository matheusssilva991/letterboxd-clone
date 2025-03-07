import { PickType } from '@nestjs/mapped-types';
import { ActorsQueryDto } from './actors-query.dto';

export class ActorQueryDto extends PickType(ActorsQueryDto, ['include']) {}
