import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'Informe um e-mail.' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 8 caracteres, com maiúsculas, minúsculas, números e símbolos)',
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
}
