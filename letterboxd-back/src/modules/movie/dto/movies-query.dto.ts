import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class MoviesQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Título do filme para filtrar' })
  @IsString({ message: 'Informe um titulo válido.' })
  @IsOptional({ message: 'Titulo é opcional.' })
  title?: string;

  @ApiPropertyOptional({ description: 'Sinopse do filme para filtrar' })
  @IsString({ message: 'Informe uma sinopse válida.' })
  @IsOptional({ message: 'Sinopse é opcional.' })
  synopsis?: string;

  @ApiPropertyOptional({ description: 'Duração do filme em minutos', example: 120 })
  @Type(() => Number)
  @IsNumber({}, { message: 'Informe uma duração válida.' })
  @IsPositive({ message: 'Informe uma duração positiva.' })
  @IsOptional({ message: 'Duração é opcional.' })
  duration?: number;

  @ApiPropertyOptional({ description: 'Relações a incluir (ex: actors,directors,genres)', example: 'actors,directors' })
  @IsOptional({ message: 'Campo com filmes é opcional.' })
  @IsString({ message: 'Informe um valor válido.' })
  include?: string;

  @ApiPropertyOptional({ description: 'Ordenação (ex: id:ASC, title:DESC)', example: 'id:ASC' })
  @IsOptional({ message: 'Campo ordenação é opcional.' })
  @IsString({ message: 'Informe um valor válido para ordenação.' })
  order?: string;
}
