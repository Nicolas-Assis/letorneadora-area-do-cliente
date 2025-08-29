import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({ 
    description: 'Indica se a operação foi bem-sucedida',
    example: true,
  })
  success: boolean;

  @ApiProperty({ 
    description: 'Mensagem descritiva da operação',
    example: 'Operação realizada com sucesso',
  })
  message: string;

  @ApiProperty({ 
    description: 'Dados retornados pela operação', 
    required: false,
  })
  data?: T;

  @ApiProperty({ 
    description: 'Timestamp da resposta',
    example: '2024-08-28T19:30:00.000Z',
  })
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

export class PaginationMetaDto {
  @ApiProperty({ 
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({ 
    description: 'Itens por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({ 
    description: 'Total de itens',
    example: 100,
  })
  total: number;

  @ApiProperty({ 
    description: 'Total de páginas',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({ 
    description: 'Tem página anterior',
    example: false,
  })
  hasPrevious: boolean;

  @ApiProperty({ 
    description: 'Tem próxima página',
    example: true,
  })
  hasNext: boolean;
}

export class PaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  @ApiProperty({ 
    description: 'Metadados de paginação',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  constructor(
    success: boolean,
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number,
  ) {
    super(success, message, data);
    const totalPages = Math.ceil(total / limit);
    this.meta = {
      page,
      limit,
      total,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
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

