import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class UserBasicDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: 'joaosilva' })
  username: string;
}

class MovieBasicDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'A Origem' })
  title: string;

  @ApiProperty({ example: 'https://example.com/movie.jpg', nullable: true })
  imagePath: string;
}

@Expose()
export class ReviewResponseDto {
  @ApiProperty({ example: 1, description: 'ID da avaliação' })
  id: number;

  @ApiProperty({
    example: 5,
    description: 'Nota de 1 a 5 estrelas',
    minimum: 1,
    maximum: 5,
  })
  stars: number;

  @ApiProperty({
    example: 'Filme incrível!',
    description: 'Comentário sobre o filme',
  })
  comment: string;

  @ApiProperty({ example: 1 })
  movieId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ type: MovieBasicDto, description: 'Dados básicos do filme' })
  @Type(() => MovieBasicDto)
  movie?: MovieBasicDto;

  @ApiProperty({ type: UserBasicDto, description: 'Dados básicos do usuário' })
  @Type(() => UserBasicDto)
  user?: UserBasicDto;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<ReviewResponseDto>) {
    Object.assign(this, partial);
  }
}
