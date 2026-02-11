import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDirectorDto {
  @ApiProperty({
    description: 'Nome do diretor',
    example: 'Christopher Nolan',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Informe um nome válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  @Length(1, 255, { message: 'O nome deve ter entre 1 e 255 caracteres.' })
  name: string;

  @ApiProperty({
    description: 'Descrição/biografia do diretor',
    example: 'Diretor britânico conhecido por filmes complexos e narrativas não-lineares...',
  })
  @IsString({ message: 'Informe uma descrição válida.' })
  @IsNotEmpty({ message: 'Informe uma descrição.' })
  description: string;

  @ApiPropertyOptional({
    description: 'Arquivo de imagem do diretor',
    type: 'string',
    format: 'binary',
  })
  @IsString({ message: 'Informe um caminho de imagem válido.' })
  @IsOptional({ message: 'Caminho de imagem é opcional.' })
  imagePath: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  updatedAt?: Date;
}
