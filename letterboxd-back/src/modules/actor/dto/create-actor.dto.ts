import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateActorDto {
  @IsString({ message: 'Informe um nome válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  name: string;

  @IsString({ message: 'Informe uma descrição válida.' })
  @IsNotEmpty({ message: 'Informe uma descrição.' })
  description: string;

  @IsString({ message: 'Informe um caminho de imagem válido.' })
  @IsNotEmpty({ message: 'Informe um caminho de imagem.' })
  imagePath: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  updatedAt?: Date;
}
