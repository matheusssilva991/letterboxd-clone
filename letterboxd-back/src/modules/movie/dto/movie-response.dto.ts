import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class GenreBasicDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ação' })
  name: string;
}

class DirectorBasicDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Christopher Nolan' })
  name: string;
}

class ActorBasicDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Leonardo DiCaprio' })
  name: string;
}

@Expose()
export class MovieResponseDto {
  @ApiProperty({ example: 1, description: 'ID do filme' })
  id: number;

  @ApiProperty({ example: 'A Origem', description: 'Título do filme' })
  title: string;

  @ApiProperty({
    example: 'Um ladrão que rouba segredos corporativos...',
    description: 'Sinopse do filme',
  })
  synopsis: string;

  @ApiProperty({ example: 148, description: 'Duração em minutos' })
  duration: number;

  @ApiProperty({ example: '2010-07-16', description: 'Data de lançamento' })
  releaseDate: Date;

  @ApiProperty({
    example: 'https://example.com/movie.jpg',
    description: 'Caminho da imagem',
    nullable: true,
  })
  imagePath: string;

  @ApiProperty({ type: [GenreBasicDto], description: 'Gêneros do filme' })
  @Type(() => GenreBasicDto)
  genres?: GenreBasicDto[];

  @ApiProperty({ type: [DirectorBasicDto], description: 'Diretores do filme' })
  @Type(() => DirectorBasicDto)
  directors?: DirectorBasicDto[];

  @ApiProperty({ type: [ActorBasicDto], description: 'Atores do filme' })
  @Type(() => ActorBasicDto)
  actors?: ActorBasicDto[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<MovieResponseDto>) {
    Object.assign(this, partial);
  }
}
