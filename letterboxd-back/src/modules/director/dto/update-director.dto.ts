import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectorDto } from './create-director.dto';

export class UpdateActorDto extends PartialType(CreateDirectorDto) {}
