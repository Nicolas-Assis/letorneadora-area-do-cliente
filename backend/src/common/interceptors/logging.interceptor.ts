import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const startTime = Date.now();

    // Log da requisição
    this.logger.log(
      `Incoming Request: ${method} ${url} - ${ip} - ${userAgent}`
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          const { statusCode } = response;

          // Log da resposta bem-sucedida
          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${statusCode} - ${duration}ms`
          );

          // Log detalhado para desenvolvimento
          if (process.env.NODE_ENV === 'development') {
            this.logger.debug(`Response Data: ${JSON.stringify(data).substring(0, 200)}...`);
          }
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          const statusCode = error.status || 500;

          // Log do erro
          this.logger.error(
            `Error Response: ${method} ${url} - ${statusCode} - ${duration}ms - ${error.message}`
          );
        },
      })
    );
  }
}

