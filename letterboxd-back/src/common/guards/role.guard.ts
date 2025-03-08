import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: RoleEnum[], userRole: RoleEnum): boolean {
    return roles.includes(userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    return this.matchRoles(roles, user.role);
  }
}
