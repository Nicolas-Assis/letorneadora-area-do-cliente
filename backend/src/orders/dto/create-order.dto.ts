import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsDateString, IsNumber, Min, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  productId: number;

  @ApiProperty({
    description: 'Quantidade solicitada',
    example: 5,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  @Transform(({ value }) => parseFloat(value))
  quantity: number;

  @ApiProperty({
    description: 'Preço unitário',
    example: 150.50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  unitPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID do perfil do cliente',
    example: 'uuid-do-cliente',
  })
  @IsString()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({
    description: 'Observações do pedido',
    example: 'Pedido urgente com acabamento especial',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'ID do orçamento relacionado (se aplicável)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  quoteId?: number;

  @ApiProperty({
    description: 'Data estimada de entrega (ISO 8601)',
    example: '2024-09-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @ApiProperty({
    description: 'Itens do pedido',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

