/**
 * Guard de Autorização por Roles (Papéis)
 *
 * Responsável por:
 * - Verificar se o usuário autenticado possui a role necessária
 * - Controlar acesso a rotas baseado em permissões
 * - Permitir acesso apenas para roles específicas (admin, user, etc)
 *
 * Uso:
 * @Roles(RoleEnum.ADMIN)
 * @UseGuards(JwtAuthGuard, RoleGuard)
 * async rotaProtegida() { ... }
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Verifica se a role do usuário está entre as roles permitidas
   *
   * @param roles - Lista de roles permitidas para acessar a rota
   * @param userRole - Role do usuário autenticado
   * @returns true se o usuário possui uma das roles permitidas
   */
  matchRoles(roles: RoleEnum[], userRole: RoleEnum): boolean {
    return roles.includes(userRole);
  }

  /**
   * Determina se o usuário pode ativar/acessar a rota
   *
   * @param context - Contexto de execução da requisição
   * @returns true se o acesso for permitido, false caso contrário
   */
  canActivate(context: ExecutionContext): boolean {
    // Obtém a requisição HTTP
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Usuário injetado pelo JwtAuthGuard

    // Busca as roles definidas no decorator @Roles() do handler/controller
    const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());

    // Se não há roles especificadas, permite acesso (rota não tem restrição de role)
    if (!roles) {
      return true;
    }

    // Verifica se a role do usuário está entre as roles permitidas
    return this.matchRoles(roles, user.role);
  }
}
