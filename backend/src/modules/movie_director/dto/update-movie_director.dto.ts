import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateMovieDirectorDto {
  @ApiProperty({
    description: 'Notas ou informações adicionais sobre o papel',
    example: 'Diretor responsável pela edição',
    required: false,
  })
  @IsString({ message: 'Notas devem ser uma string.' })
  @Length(0, 255, { message: 'Notas devem ter entre 0 e 255 caracteres.' })
  @IsOptional()
  notes?: string;
}
