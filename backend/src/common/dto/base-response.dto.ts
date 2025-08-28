import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({ description: 'Indica se a operação foi bem-sucedida' })
  success: boolean;

  @ApiProperty({ description: 'Mensagem descritiva da operação' })
  message: string;

  @ApiProperty({ description: 'Dados retornados pela operação', required: false })
  data?: T;

  @ApiProperty({ description: 'Timestamp da resposta' })
  timestamp: string;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(message: string, data?: T): BaseResponseDto<T> {
    return new BaseResponseDto(true, message, data);
  }

  static error(message: string): BaseResponseDto {
    return new BaseResponseDto(false, message);
  }
}

export class PaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  @ApiProperty({ description: 'Informações de paginação' })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(
    success: boolean,
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number,
  ) {
    super(success, message, data);
    this.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  static create<T>(
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number,
  ): PaginatedResponseDto<T> {
    return new PaginatedResponseDto(true, message, data, page, limit, total);
  }
}

