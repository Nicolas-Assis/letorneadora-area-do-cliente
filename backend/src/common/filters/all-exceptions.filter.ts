import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseResponseDto } from '../dto/base-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || 'Erro interno do servidor';
        
        // Tratar erros de validação
        if (Array.isArray(responseObj.message)) {
          errors = responseObj.message;
          message = 'Dados de entrada inválidos';
        }
      } else {
        message = 'Erro interno do servidor';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro interno do servidor';
    }

    // Log do erro
    const errorLog = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
      ...(exception instanceof Error && { stack: exception.stack }),
    };

    if (status >= 500) {
      this.logger.error('Erro interno do servidor', errorLog);
    } else if (status >= 400) {
      this.logger.warn('Erro de cliente', errorLog);
    }

    // Resposta padronizada
    const errorResponse = {
      ...BaseResponseDto.error(message),
      ...(errors && { errors }),
      path: request.url,
      method: request.method,
    };

    response.status(status).json(errorResponse);
  }
}

