/**
 * Service de Autenticação
 *
 * Responsável por:
 * - Processar login de usuários
 * - Gerar e assinar tokens JWT
 * - Validar usuários autenticados
 */

import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { GeneratedToken, JwtPayload } from '../../common/types/auth.types';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME = 15 * 60; // 15 minutos em segundos

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * Realiza o login do usuário
   *
   * @param loginUserDto - Credenciais do usuário (email/username e senha)
   * @returns Token JWT assinado e informações de expiração
   */
  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email } = loginUserDto;

    // Verifica se a conta está bloqueada por tentativas de login falhas
    const lockKey = `login_lock:${email}`;
    const isLocked = await this.redis.exists(lockKey);

    if (isLocked) {
      this.logger.warn(`Tentativa de login em conta bloqueada: ${email}`);
      throw new UnauthorizedException(
        'Conta temporariamente bloqueada. Tente novamente em 15 minutos.',
      );
    }

    try {
      // Valida as credenciais do usuário no banco de dados
      const user = await this.userService.validateLogin(loginUserDto);

      // Reseta contador de tentativas falhas ao fazer login com sucesso
      const attemptsKey = `login_attempts:${email}`;
      await this.redis.del(attemptsKey);

      this.logger.log(`Login bem-sucedido para: ${email}`);

      // Gera e retorna os tokens
      const tokenData = this._createToken(user);
      return {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expiresIn: tokenData.expiresIn,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      // Incrementa contador de tentativas falhas
      const attemptsKey = `login_attempts:${email}`;
      const attempts = await this.redis.incr(attemptsKey);

      // Define TTL para o contador (30 minutos)
      await this.redis.expire(attemptsKey, 30 * 60);

      this.logger.warn(
        `Tentativa de login falha para ${email}. Tentativa ${attempts}/${this.MAX_LOGIN_ATTEMPTS}`,
      );

      // Se atingiu limite de tentativas, bloqueia a conta
      if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
        await this.redis.setex(lockKey, this.LOCK_TIME, 'locked');
        this.logger.warn(
          `Conta bloqueada por excesso de tentativas falhas: ${email}`,
        );
        throw new UnauthorizedException(
          'Muitas tentativas de login. Conta bloqueada por 15 minutos.',
        );
      }

      throw error;
    }
  }

  async logout(token: string, expiresIn: number): Promise<void> {
    try {
      // Decodifica o token para obter informações
      const payload = this.jwtService.decode(token) as JwtPayload & {
        exp?: number;
      };

      if (!payload) {
        throw new BadRequestException('Token inválido');
      }

      // Calcula tempo até expiração do token
      const now = Math.floor(Date.now() / 1000);
      const ttl = (payload.exp || now + expiresIn) - now;

      if (ttl > 0) {
        // Adiciona token à blacklist no Redis com TTL igual ao tempo de expiração
        const blacklistKey = `token_blacklist:${payload.sub}`;
        await this.redis.setex(blacklistKey, ttl, token);
        this.logger.log(`Logout realizado para usuário: ${payload.email}`);
      }
    } catch (error) {
      this.logger.error('Erro ao processar logout:', error);
      throw new BadRequestException('Erro ao processar logout');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    expiresIn: string;
  }> {
    try {
      // Verifica se o refresh token está válido
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get<string>('REFRESH_SECRET') ||
          this.configService.get<string>('JWT_SECRET'),
      }) as any;

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token type inválido');
      }

      // Busca o usuário para obter informações atuais
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Gera novo access token
      const accessToken = this._createAccessToken(user);

      this.logger.log(`Access token renovado para usuário: ${user.email}`);

      return {
        access_token: accessToken,
        expiresIn: this.configService.get<string>('EXPIRES_IN') || '15m',
      };
    } catch (error) {
      this.logger.error('Erro ao renovar access token:', error.message);
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  async isTokenBlacklisted(
    token: string,
    userId: number,
  ): Promise<boolean> {
    const blacklistKey = `token_blacklist:${userId}`;
    const blacklisted = await this.redis.get(blacklistKey);
    return blacklisted === token;
  }

  private _createAccessToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      iss: 'auth-service',
      iat: Math.floor(Date.now() / 1000),
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Cria e assina um token JWT para o usuário autenticado
   *
   * @param user - Usuário autenticado
   * @returns Objeto contendo o token e tempo de expiração
   * @private
   */
  private _createToken(user: any): GeneratedToken {
    // Access token com expiração curta (15m padrão)
    const accessToken = this._createAccessToken(user);

    // Refresh token com expiração longa (7d padrão)
    const refreshTokenPayload = {
      sub: user.id,
      username: user.username,
      type: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: (this.configService.get<string>('REFRESH_EXPIRES_IN') || '7d') as any,
      secret:
        this.configService.get<string>('REFRESH_SECRET') ||
        this.configService.get<string>('JWT_SECRET'),
    });

    return {
      expiresIn: this.configService.get<string>('EXPIRES_IN') || '15m',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Valida um usuário a partir do payload do JWT
   *
   * Usado pela estratégia JWT do Passport para validar
   * se o usuário do token ainda existe e é válido
   *
   * @param payload - Payload decodificado do JWT
   * @returns Usuário validado ou undefined
   */
  async validateUser(payload: JwtPayload): Promise<User> {
    // Busca o usuário por email e username
    const userByEmail = await this.userService.findByEmail(payload.email);
    const userByUsername = await this.userService.findByUsername(
      payload.username,
    );

    // Verifica se ambas as buscas retornaram o mesmo usuário
    // Isso garante que o email e username ainda pertencem ao mesmo usuário
    if (
      userByEmail &&
      userByUsername &&
      Object.is(userByEmail, userByUsername)
    ) {
      return userByEmail;
    }
  }
}
