import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum';

export const Roles = (role: RoleEnum) => SetMetadata('roles', role);
