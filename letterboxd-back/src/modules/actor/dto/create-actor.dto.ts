import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateActorDto {
  @IsString({ message: 'Informe um nome do ator ou atriz válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  name: string;

  @IsString({ message: 'Informe uma descrição válida.' })
  @IsNotEmpty({ message: 'Informe uma descrição.' })
  description: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  updatedAt?: Date;
}
