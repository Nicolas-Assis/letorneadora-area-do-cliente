// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from '../../../services/auth.service';

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req = context.switchToHttp().getRequest();
//     const authHeader = req.headers['authorization'] || req.headers['Authorization'];
//     if (!authHeader) {
//       throw new UnauthorizedException('Authorization header missing');
//     }

//     const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
//     const parts = header.split(' ');
//     if (parts.length !== 2) {
//       throw new UnauthorizedException('Invalid authorization header format');
//     }

//     const [scheme, token] = parts;
//     if (scheme !== 'Bearer' || !token) {
//       throw new UnauthorizedException('Invalid token');
//     }

//     // utiliza apenas validateToken do AuthService
//     const validateFn =
//       typeof this.authService.validateToken === 'function'
//         ? this.authService.validateToken.bind(this.authService)
//         : null;

//     if (!validateFn) {
//       throw new UnauthorizedException('AuthService does not expose token validation');
//     }

//     const user = await validateFn(token).catch(() => null);
//     if (!user) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }

//     req.user = user;
//     return true;
//   }
// }
