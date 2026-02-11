import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActorDto {
  @ApiProperty({
    description: 'Nome do ator',
    example: 'Leonardo DiCaprio',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Informe um nome válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  @Length(1, 255, { message: 'O nome deve ter entre 1 e 255 caracteres.' })
  name: string;

  @ApiProperty({
    description: 'Descrição/biografia do ator',
    example: 'Ator americano conhecido por seus papéis dramáticos...',
  })
  @IsString({ message: 'Informe uma descrição válida.' })
  @IsNotEmpty({ message: 'Informe uma descrição.' })
  description: string;

  @ApiPropertyOptional({
    description: 'Arquivo de imagem do ator',
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
