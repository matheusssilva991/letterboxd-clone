import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class DirectorsQueryDto {
  @IsString({ message: 'Informe um nome válido.' })
  @IsOptional({ message: 'Nome é opcional.' })
  name: string;

  @IsString({ message: 'Informe uma descrição válida.' })
  @IsOptional({ message: 'Descrição é opcional.' })
  description: string;

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
