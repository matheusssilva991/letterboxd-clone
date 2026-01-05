/**
 * Decorator para definir roles (papéis) permitidas em uma rota
 *
 * Este decorator trabalha em conjunto com o RoleGuard para implementar
 * controle de acesso baseado em roles (RBAC - Role-Based Access Control)
 *
 * @example
 * // Apenas administradores podem acessar
 * @Roles(RoleEnum.ADMIN)
 * @UseGuards(JwtAuthGuard, RoleGuard)
 * async deleteUser() { ... }
 *
 * @example
 * // Múltiplas roles permitidas
 * @Roles(RoleEnum.ADMIN, RoleEnum.MODERATOR)
 * @UseGuards(JwtAuthGuard, RoleGuard)
 * async updateContent() { ... }
 *
 * @param roles - Lista de roles permitidas para acessar a rota
 * @returns Decorator que adiciona metadata de roles ao handler
 */

import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
