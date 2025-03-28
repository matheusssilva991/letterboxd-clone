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

export class CreateMovieReviewDto {
  @Type(() => Number)
  @IsInt({ message: 'Numero de estrelas deve ser um número inteiro.' })
  @IsPositive({ message: 'Numero de estrelas deve ser positivo.' })
  @Max(5, { message: 'Número de estrelas deve ser no máximo 5.' })
  @Min(1, { message: 'Número de estrelas deve ser no mínimo 1.' })
  @IsNotEmpty({ message: 'Informe o número de estrelas.' })
  stars: number;

  @IsString({ message: 'Comentário deve ser uma string.' })
  @Length(1, 255, { message: 'Comentário deve ter entre 1 e 255 caracteres.' })
  @IsNotEmpty({ message: 'Informe o comentário.' })
  comment: string;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt: Date;
}
