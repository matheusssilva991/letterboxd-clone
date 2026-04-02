import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../common/types/auth.types';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Rejeita tokens expirados
      secretOrKey: configService.get<string>('SECRET_KEY'), // Usa ConfigService
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload): Promise<User> {
    this.logger.log(`Validando token para o usuário: ${payload.email}`);

    // Obtém o token do header Authorization
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // Verifica se o token está em blacklist (foi feito logout)
    if (token && (await this.authService.isTokenBlacklisted(token, payload.sub))) {
      this.logger.warn(`Token em blacklist para usuário: ${payload.email}`);
      throw new UnauthorizedException('Token foi revogado (logout realizado)');
    }

    return await this.authService.validateUser(payload);
  }
}
