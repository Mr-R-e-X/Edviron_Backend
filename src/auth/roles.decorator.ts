import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('School' | 'Admin')[]) =>
  SetMetadata(ROLES_KEY, roles);
