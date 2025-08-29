// import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as jwt from 'jsonwebtoken';
// import * as jwksRsa from 'jwks-rsa';

// @Injectable()
// export class AuthService {
//   private readonly logger = new Logger(AuthService.name);
//   private jwksClient: jwksRsa.JwksClient;

//   constructor(private readonly config: ConfigService) {
//     const jwksUri =
//       this.config.get<string>('JWKS_URI') ||
//       this.config.get<string>('SUPABASE_JWKS_URI') ||
//       // substitua se necessário: 'https://<seu-projeto>.supabase.co/auth/v1/certs'
//       '';
//     if (!jwksUri) {
//       this.logger.warn('JWKS_URI não configurado. validateToken pode falhar.');
//     }
//     this.jwksClient = jwksRsa({
//       jwksUri,
//       cache: true,
//       cacheMaxEntries: 5,
//       cacheMaxAge: 10 * 60 * 1000, // 10 minutos
//     });
//   }

//   // Valida o JWT e retorna o payload (ou lança UnauthorizedException)
//   async validateToken(token: string): Promise<any> {
//     try {
//       const decodedHeader: any = jwt.decode(token, { complete: true });
//       if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
//         this.logger.debug('token sem kid no header');
//         throw new UnauthorizedException('Invalid token');
//       }
//       const kid = decodedHeader.header.kid;

//       const key = await new Promise<jwksRsa.SigningKey>((resolve, reject) => {
//         this.jwksClient.getSigningKey(kid, (err, key) => {
//           if (err || !key) {
//             reject(err || new Error('Signing key not found'));
//           } else {
//             resolve(key);
//           }
//         });
//       });
//       const publicKey = key.getPublicKey();

//       const issuer =
//         this.config.get<string>('JWT_ISSUER') || this.config.get<string>('SUPABASE_ISSUER');
//       const audience =
//         this.config.get<string>('JWT_AUDIENCE') || this.config.get<string>('SUPABASE_AUDIENCE');

//       const options: jwt.VerifyOptions = {
//         algorithms: ['RS256'],
//         ...(issuer ? { issuer } : {}),
//         ...(audience ? { audience } : {}),
//       };

//       const payload = jwt.verify(token, publicKey, options);
//       // opcional: mapear/normalizar payload para user (id, email, roles)
//       return payload;
//     } catch (err) {
//       this.logger.debug('validateToken failed', err as any);
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//   }
// }
