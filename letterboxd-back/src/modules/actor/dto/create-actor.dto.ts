import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateActorDto {
  @IsString({ message: 'Informe um nome do ator ou atriz válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  name: string;
  descicao: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  updatedAt?: Date;
}
