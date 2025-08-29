import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';
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
    example: 150.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  unitPrice: number;

  @ApiProperty({
    description: 'Especificações do produto',
    example: 'Cor: Vermelho, Tamanho: M',
    required: false,
  })
  @IsOptional()
  @IsString()
  specifications?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID do perfil',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({
    description: 'ID do orçamento',
    example: '456e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  quoteId?: string;

  @ApiProperty({
    description: 'Data estimada de entrega',
    example: '2023-10-10',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @ApiProperty({
    description: 'Observações do pedido',
    example: 'Pedido urgente com acabamento especial',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Itens do pedido',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    description: 'IDs das categorias',
    example: [1, 2, 3],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  categoryIds?: number[];
}
