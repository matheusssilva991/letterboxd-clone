import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @IsString({ message: 'Informe um nome válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  name: string;

  @IsString({ message: 'Informe uma sinopse válida.' })
  @IsNotEmpty({ message: 'Informe uma sinopse.' })
  synopsis: string;

  @Type(() => Number)
  @IsInt({ message: 'Informe uma duração válida.' })
  @IsPositive({ message: 'Informe uma duração positiva.' })
  @IsNotEmpty({ message: 'Informe uma duração.' })
  duration: number;

  @Type(() => Date)
  @IsDate({ message: 'Informe uma data de lançamento válida.' })
  @IsNotEmpty({ message: 'Informe uma data de lançamento.' })
  releaseDate: Date;

  @IsString({ message: 'Informe um caminho de imagem válido.' })
  @IsNotEmpty({ message: 'Informe um caminho de imagem.' })
  imagePath: string;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt?: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt?: Date;
}
