import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class DirectorsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Nome do diretor para filtrar' })
  @IsString({ message: 'Informe um nome válido.' })
  @IsOptional({ message: 'Nome é opcional.' })
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição do diretor para filtrar' })
  @IsString({ message: 'Informe uma descrição válida.' })
  @IsOptional({ message: 'Descrição é opcional.' })
  description?: string;

  @ApiPropertyOptional({ description: 'Relações a incluir (ex: movies)', example: 'movies' })
  @IsOptional({ message: 'Campo com filmes é opcional.' })
  @IsString({ message: 'Informe um valor válido.' })
  include?: string;

  @ApiPropertyOptional({ description: 'Ordenação (ex: id:ASC, name:DESC)', example: 'id:ASC' })
  @IsOptional({ message: 'Campo ordenação é opcional.' })
  @IsString({ message: 'Informe um valor válido para ordenação.' })
  order?: string;
}
