import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateDirectorDto {
  @IsString({ message: 'Informe um nome válido.' })
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
