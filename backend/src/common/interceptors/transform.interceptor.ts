import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '../dto/base-response.dto';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Se a resposta já é um BaseResponseDto, retornar como está
        if (data && typeof data === 'object' && 'success' in data && 'timestamp' in data) {
          return data;
        }

        // Se é uma resposta vazia (ex: DELETE), não transformar
        if (data === undefined || data === null) {
          return data;
        }

        // Transformar resposta simples em BaseResponseDto
        return BaseResponseDto.success('Operação realizada com sucesso', data);
      })
    );
  }
}

