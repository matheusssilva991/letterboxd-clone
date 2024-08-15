import { Type } from 'class-transformer';
import { IsEmpty, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateMovieDirectorDto {
  @Type(() => Number)
  @IsInt({ message: 'Informe um ID de filme válido.' })
  @IsPositive({ message: 'Informe um ID de filme positivo.' })
  @IsNotEmpty({ message: 'Informe um ID de filme.' })
  movieId: number;

  @Type(() => Number)
  @IsInt({ message: 'Informe um ID de diretor válido.' })
  @IsPositive({ message: 'Informe um ID de diretor positivo.' })
  @IsNotEmpty({ message: 'Informe um ID de diretor.' })
  directorId: number;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt: Date;
}
