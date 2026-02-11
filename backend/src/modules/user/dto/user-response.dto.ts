import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id: number;

  @ApiProperty({ example: 'João Silva', description: 'Nome completo' })
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ example: 'joaosilva', description: 'Nome de usuário' })
  username: string;

  @ApiProperty({ example: 'user', description: 'Papel do usuário' })
  role: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Caminho da imagem de perfil',
    nullable: true,
  })
  imagePath: string;

  @Exclude()
  password: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
