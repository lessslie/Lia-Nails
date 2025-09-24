import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../interfaces/auth-user.interface';

export const GetUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext): AuthUser | AuthUser[keyof AuthUser] => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    // Si se especifica una propiedad específica, devolverla
    if (data) {
      return user[data];
    }

    // Devolver el usuario completo
    return user;
  },
);