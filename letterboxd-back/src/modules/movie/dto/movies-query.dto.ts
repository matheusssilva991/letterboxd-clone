import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class MoviesQueryDto {
  @IsString({ message: 'Informe um titulo válido.' })
  @IsOptional({ message: 'Titulo é opcional.' })
  title: string;

  @IsString({ message: 'Informe uma sinopse válida.' })
  @IsOptional({ message: 'Sinopse é opcional.' })
  synopsis: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Informe uma duração válida.' })
  @IsPositive({ message: 'Informe uma duração positiva.' })
  @IsOptional({ message: 'Duração é opcional.' })
  duration: number;

  @IsOptional({ message: 'Campo com filmes é opcional.' })
  @IsString({ message: 'Informe um valor válido.' })
  include: string;

  @IsNumber({}, { message: 'Página deve ser um número.' })
  @IsPositive({ message: 'Página deve ser um número positivo.' })
  @Type(() => Number)
  @IsOptional({ message: 'Página é opcional.' })
  page: number;

  @IsNumber({}, { message: 'Limite deve ser um número.' })
  @IsPositive({ message: 'Limite deve ser um número positivo.' })
  @Type(() => Number)
  @IsOptional({ message: 'Limite é opcional.' })
  limit: number;

  @IsOptional({ message: 'Campo ordenação é opcional.' })
  order: string;
}
