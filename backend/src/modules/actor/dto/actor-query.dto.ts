import { PickType } from '@nestjs/swagger';
import { ActorsQueryDto } from './actors-query.dto';

export class ActorQueryDto extends PickType(ActorsQueryDto, ['include']) {}
