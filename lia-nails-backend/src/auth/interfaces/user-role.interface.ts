/**
 * Roles disponibles en el sistema Lia Nails
 */
export type UserRole = 'admin' | 'empleada';

/**
 * Enum para los roles (útil para validaciones y documentación)
 */
export enum UserRoleEnum {
  ADMIN = 'admin',
  EMPLEADA = 'empleada',
}

/**
 * Descripción de permisos por rol
 */
export const ROLE_PERMISSIONS = {
  admin: [
    'manage_empleadas',
    'manage_servicios', 
    'manage_turnos',
    'view_reports',
    'manage_users',
  ],
  empleada: [
    'view_own_schedule',
    'manage_own_services',
    'view_clientas',
  ],
} as const;