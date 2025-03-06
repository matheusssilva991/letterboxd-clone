import { Type } from 'class-transformer';
import { IsEmpty, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateMovieReviewDto {
  @Type(() => Number)
  @IsInt({ message: 'Informe um ID do usuário válido.' })
  @IsPositive({ message: 'Informe um ID do usuário positivo.' })
  @IsNotEmpty({ message: 'Informe um ID do usuário.' })
  userId: number;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt: Date;
}
