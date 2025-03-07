import { Body, Controller, Post } from '@nestjs/common';
import { GeneratedToken } from '../../common/types/auth.types';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<GeneratedToken> {
    return await this.authService.login(loginUserDto);
  }
}
