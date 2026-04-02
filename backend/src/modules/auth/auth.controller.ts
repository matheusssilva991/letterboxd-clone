import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({ status: 201, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginResponseDto> {
    const data = await this.authService.login(loginUserDto);

    return new LoginResponseDto(data);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout do usuário (adiciona token à blacklist)' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  public async logout(
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const user = request.user as any;
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return { message: 'Token não encontrado no header' };
    }

    // Calcula a expiração padrão do access token em segundos
    const expiresIn = this.getTokenExpiresInSeconds();
    await this.authService.logout(token, expiresIn);

    return { message: 'Logout realizado com sucesso' };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar token de acesso usando refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    schema: {
      properties: {
        access_token: { type: 'string' },
        expiresIn: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh token inválido ou expirado' })
  public async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string; expiresIn: string }> {
    return this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
  }

  private getTokenExpiresInSeconds(): number {
    // Converte formato TTL padrão (ex: '15m', '7d') para segundos
    // Default é 15 minutos = 900 segundos
    return 900;
  }
}
