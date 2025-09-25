import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../interfaces/user-role.interface';

export const ROLES_KEY = 'roles';

/**
 * Decorador para especificar los roles requeridos para acceder a un endpoint
 * @param roles - Roles permitidos para acceder al recurso
 * @example @Roles('admin', 'empleada')
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);