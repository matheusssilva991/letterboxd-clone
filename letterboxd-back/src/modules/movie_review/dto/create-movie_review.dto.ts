import { Type } from 'class-transformer';
import {
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieReviewDto {
  @ApiProperty({
    description: 'Avaliação do filme em estrelas (1 a 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @Type(() => Number)
  @IsInt({ message: 'Numero de estrelas deve ser um número inteiro.' })
  @IsPositive({ message: 'Numero de estrelas deve ser positivo.' })
  @Max(5, { message: 'Número de estrelas deve ser no máximo 5.' })
  @Min(1, { message: 'Número de estrelas deve ser no mínimo 1.' })
  @IsNotEmpty({ message: 'Informe o número de estrelas.' })
  stars: number;

  @ApiProperty({
    description: 'Comentário sobre o filme',
    example: 'Um dos melhores filmes que já assisti!',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Comentário deve ser uma string.' })
  @Length(1, 255, { message: 'Comentário deve ter entre 1 e 255 caracteres.' })
  @IsNotEmpty({ message: 'Informe o comentário.' })
  comment: string;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt: Date;
}
