import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateDirectorDto {
  @IsString({ message: 'Informe um nome válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  @Length(1, 255, { message: 'O nome deve ter entre 1 e 255 caracteres.' })
  name: string;

  @IsString({ message: 'Informe uma descrição válida.' })
  @IsNotEmpty({ message: 'Informe uma descrição.' })
  description: string;

  @IsString({ message: 'Informe um caminho de imagem válido.' })
  @IsOptional({ message: 'Caminho de imagem é opcional.' })
  imagePath: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  updatedAt?: Date;
}
