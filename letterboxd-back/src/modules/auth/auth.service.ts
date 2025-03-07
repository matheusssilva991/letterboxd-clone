import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GeneratedToken, JwtPayload } from '../../common/types/auth.types';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<any> {
    // Busca o usuário no banco de dados
    const user = await this.userService.validateLogin(loginUserDto);

    // generate and sign token
    return this._createToken(user);
  }

  private _createToken(user: any): GeneratedToken {
    const payload: JwtPayload = {
      sub: user.id,
      iss: 'auth-service',
      iat: Date.now(),
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const Authorization = this.jwtService.sign(payload);
    return {
      expiresIn: this.configService.get<string>('EXPIRES_IN'),
      Authorization,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const userByEmail = await this.userService.findByEmail(payload.email);
    const userByUsername = await this.userService.findByUsername(
      payload.username,
    );

    if (
      userByEmail &&
      userByUsername &&
      Object.is(userByEmail, userByUsername)
    ) {
      return userByEmail;
    }
  }
}
