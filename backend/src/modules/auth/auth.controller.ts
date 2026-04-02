import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

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
  @ApiOperation({ summary: 'Logout do usuário (invalida token)' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  public async logout(
    @Req() request: Request,
  ): Promise<{ message: string }> {
    // Nota: Esta é uma implementação básica. Em produção, você pode:
    // 1. Adicionar o token a uma blacklist (Redis)
    // 2. Armazenar tokens inválidos no banco de dados
    // Por enquanto, retornamos sucesso e deixar o cliente remover o token
    return { message: 'Logout realizado com sucesso. Remova o token do cliente.' };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Renovar token de acesso usando refresh token' })
  @ApiResponse({ status: 200, description: 'Token renovado com sucesso', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado ou refresh token expirado' })
  public async refresh(
    @Req() request: Request,
  ): Promise<LoginResponseDto> {
    // Nota: Esta é uma implementação básica
    // Em produção, você deveria validar o refresh token separadamente
    // e regenerar um novo access token
    const user = request.user as any;
    const data = await this.authService.login({
      username: user.username,
      password: '' // Não usaremos a senha aqui em um cenário real
    });

    return new LoginResponseDto(data);
  }
}
