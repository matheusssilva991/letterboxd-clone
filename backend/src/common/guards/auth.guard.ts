/**
 * Guard de Autenticação JWT
 *
 * Responsável por:
 * - Validar tokens JWT em requisições protegidas
 * - Verificar se o usuário está autenticado
 * - Lançar exceções quando a autenticação falhar
 * - Registrar logs de autenticação
 */

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que estende o AuthGuard do Passport para estratégia JWT
 *
 * Uso:
 * @UseGuards(JwtAuthGuard)
 * async minhaRota() { ... }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  /**
   * Método chamado após a validação do token JWT
   *
   * @param err - Erro ocorrido durante a validação, se houver
   * @param user - Usuário retornado pela estratégia JWT se válido
   * @param info - Informações adicionais sobre a validação
   * @param status - Status da validação
   * @returns Usuário autenticado
   * @throws UnauthorizedException se a autenticação falhar
   */
  handleRequest(err: any, user: any, info: any, status: any) {
    // Se houve erro ou usuário não foi encontrado/validado
    if (err || !user) {
      this.logger.error('Falha na autenticação JWT', err || info);
      throw new UnauthorizedException('Token inválido ou ausente.');
    }

    // Log de sucesso na autenticação
    this.logger.log(`Usuário autenticado: ${user.email} ${status}`);

    // Retorna o usuário para ser injetado no request
    return user;
  }
}
