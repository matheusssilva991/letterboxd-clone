import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RoleEnum } from '../../../common/enums/role.enum';

export class CreateUserDto {
  @IsString({ message: 'Informe um nome válido.' })
  @IsNotEmpty({ message: 'Informe um nome.' })
  name: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'Informe um e-mail.' })
  email: string;

  @IsString({ message: 'Informe um nome de usuário válido.' })
  @IsNotEmpty({ message: 'Informe um nome de usuário.' })
  username: string;

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

  @IsEnum(() => RoleEnum, {
    message: `Informe um cargo válido: ${Object.values(RoleEnum).join(', ')}.`,
  })
  @IsOptional({ message: 'Cargo é opcional.' })
  role: RoleEnum;

  @IsString({ message: 'Informe um caminho de imagem válido.' })
  @IsOptional({ message: 'Caminho de imagem é opcional.' })
  imagePath: string;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  createdAt: Date;

  @IsEmpty({ message: 'Não é necessário informar este campo.' })
  updatedAt: Date;
}
