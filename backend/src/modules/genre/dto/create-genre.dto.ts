import { IsEmpty, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({
    description: 'Nome do gênero',
    example: 'Ação',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Informe um nome válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  @Length(1, 255, { message: 'O nome deve ter entre 1 e 255 caracteres.' })
  name: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  updatedAt?: Date;
}
