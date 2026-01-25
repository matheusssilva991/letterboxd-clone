import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ActorsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Nome do ator para filtrar' })
  @IsString({ message: 'Informe um nome válido.' })
  @IsOptional({ message: 'Nome é opcional.' })
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição do ator para filtrar' })
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
