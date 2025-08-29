import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { OrderStatus } from '../../entities/order.entity';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Status do pedido',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({
    description: 'Observações do pedido',
    example: 'Pedido confirmado, iniciando produção',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Data estimada de entrega (ISO 8601)',
    example: '2024-09-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @ApiProperty({
    description: 'Data de entrega realizada (ISO 8601)',
    example: '2024-09-14T14:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  deliveredAt?: string;
}

