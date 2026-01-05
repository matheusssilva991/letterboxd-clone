/**
 * Service de Autenticação
 *
 * Responsável por:
 * - Processar login de usuários
 * - Gerar e assinar tokens JWT
 * - Validar usuários autenticados
 */

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

  /**
   * Realiza o login do usuário
   *
   * @param loginUserDto - Credenciais do usuário (email/username e senha)
   * @returns Token JWT assinado e informações de expiração
   */
  async login(loginUserDto: LoginUserDto): Promise<any> {
    // Valida as credenciais do usuário no banco de dados
    const user = await this.userService.validateLogin(loginUserDto);

    // Gera e retorna o token JWT
    return this._createToken(user);
  }

  /**
   * Cria e assina um token JWT para o usuário autenticado
   *
   * @param user - Usuário autenticado
   * @returns Objeto contendo o token e tempo de expiração
   * @private
   */
  private _createToken(user: any): GeneratedToken {
    // Payload do JWT contendo informações do usuário
    const payload: JwtPayload = {
      sub: user.id,              // Subject - ID do usuário
      iss: 'auth-service',       // Issuer - Emissor do token
      iat: Date.now(),           // Issued At - Data de emissão
      name: user.name,           // Nome do usuário
      email: user.email,         // Email do usuário
      username: user.username,   // Username do usuário
      role: user.role,           // Role do usuário (admin, user, etc)
    };

    // Assina o payload e gera o token JWT
    const Authorization = this.jwtService.sign(payload);

    return {
      expiresIn: this.configService.get<string>('EXPIRES_IN'), // Tempo de expiração configurado
      Authorization, // Token JWT
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
