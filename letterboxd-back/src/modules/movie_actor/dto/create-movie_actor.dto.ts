import { Type } from 'class-transformer';
import { IsEmpty, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateMovieActorDto {
  @Type(() => Number)
  @IsInt({ message: 'Informe um ID de filme válido.' })
  @IsPositive({ message: 'Informe um ID de filme positivo.' })
  @IsNotEmpty({ message: 'Informe um ID de filme.' })
  movieId: number;

  @Type(() => Number)
  @IsInt({ message: 'Informe um ID do ator/atriz válido.' })
  @IsPositive({ message: 'Informe um ID do ator/atriz positivo.' })
  @IsNotEmpty({ message: 'Informe um ID do ator/atriz.' })
  actorId: number;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt: Date;
}
