import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum } from '../../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsString({ message: 'Informe um nome válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@example.com',
  })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'Informe um e-mail.' })
  email: string;

  @ApiProperty({
    description: 'Nome de usuário único',
    example: 'joaosilva',
  })
  @IsString({ message: 'Informe um nome de usuário válido.' })
  @IsNotEmpty({ message: 'Informe um nome de usuário.' })
  username: string;

  @ApiProperty({
    description: 'Senha forte (mínimo 8 caracteres, com maiúsculas, minúsculas, números e símbolos)',
    example: 'Senha@123',
    minLength: 8,
  })
  @IsString({ message: 'Informe uma senha válida.' })
  @IsNotEmpty({ message: 'Informe uma senha.' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Informe uma senha forte.' },
  )
  password: string;

  @IsString({ message: 'Informe um cargo válido.' })
  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  @IsOptional({ message: 'Cargo é opcional.' })
  @IsEnum(() => RoleEnum, {
    message: `Informe um cargo válido: ${Object.values(RoleEnum).join(', ')}.`,
  })
  role: RoleEnum;

  @IsString({ message: 'Informe um caminho de imagem válido.' })
  @IsOptional({ message: 'Caminho de imagem é opcional.' })
  imagePath: string;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt: Date;
}
