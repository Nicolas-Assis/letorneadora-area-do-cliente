import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Indica se a operação foi bem-sucedida',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensagem da resposta',
    example: 'Operação realizada com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'Dados da resposta',
  })
  data?: T;

  @ApiProperty({
    description: 'Timestamp da resposta',
    example: '2024-08-28T19:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição',
    example: '/api/v1/products',
  })
  path: string;

  constructor(data?: T, message = 'Operação realizada com sucesso', path = '') {
    this.success = true;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}

export class ApiErrorResponseDto {
  @ApiProperty({
    description: 'Indica se a operação foi bem-sucedida',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Erro interno do servidor',
  })
  message: string;

  @ApiProperty({
    description: 'Código do erro HTTP',
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Detalhes do erro',
    example: 'Validation failed',
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2024-08-28T19:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição',
    example: '/api/v1/products',
  })
  path: string;

  constructor(
    message: string,
    statusCode: number,
    path: string,
    error?: string,
  ) {
    this.success = false;
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}

