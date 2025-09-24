import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: Error | null, 
    user: TUser, 
    info: Record<string, unknown> | null
  ): TUser {
    // Si hay un error o no hay usuario, lanzar excepción
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado. Por favor, inicia sesión nuevamente.');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido.');
      }
      throw new UnauthorizedException('Token de acceso requerido.');
    }
    
    return user;
  }

  getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }
}