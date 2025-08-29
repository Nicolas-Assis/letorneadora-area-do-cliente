import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../common.dto';
// import { OrderStatus } from '../../entities/order.entity';

export class FilterOrdersDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'ID do perfil do cliente para filtrar',
    example: 'uuid-do-cliente',
  })
  @IsOptional()
  @IsString()
  profileId?: string;

  // @ApiPropertyOptional({
  //   description: 'Status do pedido',
  //   enum: OrderStatus,
  //   example: OrderStatus.CONFIRMED,
  // })
  // @IsOptional()
  // @IsEnum(OrderStatus)
  // status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'ID do orçamento relacionado',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  quoteId?: number;

  @ApiPropertyOptional({
    description: 'Data de início para filtrar por criação (ISO 8601)',
    example: '2024-08-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de fim para filtrar por criação (ISO 8601)',
    example: '2024-08-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Valor mínimo do pedido',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  minTotal?: number;

  @ApiPropertyOptional({
    description: 'Valor máximo do pedido',
    example: 5000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  maxTotal?: number;

  @ApiPropertyOptional({
    description: 'Filtrar pedidos com entrega atrasada',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  overdue?: boolean;

  @ApiPropertyOptional({
    description: 'Incluir dados do cliente na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeProfile?: boolean = false;

  @ApiPropertyOptional({
    description: 'Incluir itens do pedido na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeItems?: boolean = false;
}
