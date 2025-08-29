import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      // Se não há roles requeridos, permite acesso
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('User not found in request. Make sure FirebaseAuthGuard is applied before RolesGuard.');
      return false;
    }

    // O role vem do custom claim do Firebase
    const userRole = user.role;

    if (!userRole) {
      this.logger.warn(`User ${user.uid} has no role assigned`);
      return false;
    }

    // Verificar se o role do usuário está na lista de roles permitidos
    const hasPermission = requiredRoles.includes(userRole as Role);

    if (!hasPermission) {
      this.logger.warn(`User ${user.uid} with role ${userRole} tried to access endpoint requiring roles: ${requiredRoles.join(', ')}`);
    }

    return hasPermission;
  }
}

