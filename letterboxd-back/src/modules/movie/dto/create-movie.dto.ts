import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Título do filme',
    example: 'O Poderoso Chefão',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Informe um titulo válido.' })
  @IsNotEmpty({ message: 'Informe um titulo.' })
  @Length(1, 255, { message: 'O titulo deve ter entre 1 e 255 caracteres.' })
  title: string;

  @ApiProperty({
    description: 'Sinopse do filme',
    example: 'A saga de uma família mafiosa em Nova York...',
  })
  @IsString({ message: 'Informe uma sinopse válida.' })
  @IsNotEmpty({ message: 'Informe uma sinopse.' })
  synopsis: string;

  @ApiProperty({
    description: 'Duração do filme em minutos',
    example: 175,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Informe uma duração válida.' })
  @IsPositive({ message: 'Informe uma duração positiva.' })
  @IsNotEmpty({ message: 'Informe uma duração.' })
  duration: number;

  @ApiProperty({
    description: 'Data de lançamento do filme',
    example: '1972-03-24',
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate({ message: 'Informe uma data de lançamento válida.' })
  @IsNotEmpty({ message: 'Informe uma data de lançamento.' })
  releaseDate: Date;

  @ApiPropertyOptional({
    description: 'Arquivo de imagem do filme',
    type: 'string',
    format: 'binary',
  })
  @IsString({ message: 'Informe um caminho de imagem válido.' })
  @IsOptional({ message: 'Caminho de imagem é opcional.' })
  imagePath: string;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt?: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt?: Date;
}
