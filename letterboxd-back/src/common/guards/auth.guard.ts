import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any, status: any) {
    if (err || !user) {
      this.logger.error('Falha na autenticação JWT', err || info);
      throw new UnauthorizedException('Token inválido ou ausente.');
    }

    this.logger.log(`Usuário autenticado: ${user.email} ${status}`);
    return user;
  }
}
