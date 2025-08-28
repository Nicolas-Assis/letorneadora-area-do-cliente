import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { SearchDto } from '../../common/dto/pagination.dto';

export enum OrderStatus {
  PENDING = 'pending',
  ANALYZING = 'analyzing',
  QUOTED = 'quoted',
  APPROVED = 'approved',
  IN_PRODUCTION = 'in_production',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class QueryOrdersDto extends SearchDto {
  @ApiPropertyOptional({
    description: 'Filtrar por status do pedido',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Status deve ser um valor válido' })
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por email do cliente',
    example: 'joao@example.com',
  })
  @IsOptional()
  @IsString({ message: 'Email do cliente deve ser uma string' })
  customerEmail?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por empresa do cliente',
    example: 'Empresa LTDA',
  })
  @IsOptional()
  @IsString({ message: 'Empresa do cliente deve ser uma string' })
  customerCompany?: string;

  @ApiPropertyOptional({
    description: 'Data de início para filtro (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de fim para filtro (ISO 8601)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filtrar pedidos urgentes (prazo <= 7 dias)',
    example: true,
  })
  @IsOptional()
  urgent?: boolean;
}

