import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../../../services/auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    const parts = header.split(' ');

    if (parts.length !== 2) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const [scheme, idToken] = parts;

    if (scheme !== 'Bearer' || !idToken) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const decodedToken = await this.authService.verifyIdToken(idToken);
      
      // Adicionar informações do usuário à request
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified,
        role: decodedToken.role || 'client', // role padrão
        custom_claims: decodedToken,
      };

      return true;
    } catch (error) {
      this.logger.error('Firebase token verification failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

