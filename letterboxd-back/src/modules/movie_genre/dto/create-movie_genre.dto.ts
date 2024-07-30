import { Type } from 'class-transformer';
import { IsEmpty, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateMovieGenreDto {
  @Type(() => Number)
  @IsInt({ message: 'Informe um ID de filme válido.' })
  @IsPositive({ message: 'Informe um ID de filme positivo.' })
  @IsNotEmpty({ message: 'Informe um ID de filme.' })
  movieId: number;

  @Type(() => Number)
  @IsInt({ message: 'Informe um ID de gênero válido.' })
  @IsPositive({ message: 'Informe um ID de gênero positivo.' })
  @IsNotEmpty({ message: 'Informe um ID de gênero.' })
  genreId: number;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt: Date;
}
