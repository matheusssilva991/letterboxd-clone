import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateMovieGenreDto {
  @ApiProperty({
    description: 'Notas ou informações adicionais',
    example: 'Gênero principal do filme',
    required: false,
  })
  @IsString({ message: 'Notas devem ser uma string.' })
  @Length(0, 255, { message: 'Notas devem ter entre 0 e 255 caracteres.' })
  @IsOptional()
  notes?: string;
}
