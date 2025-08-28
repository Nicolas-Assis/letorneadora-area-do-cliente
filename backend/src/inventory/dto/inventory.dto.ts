import { ApiProperty } from '@nestjs/swagger';

export class WarehouseDto {
  @ApiProperty({
    description: 'ID do armazém',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do armazém',
    example: 'Armazém Principal',
  })
  name: string;

  @ApiProperty({
    description: 'Código do armazém',
    example: 'ARM001',
  })
  code: string;
}

export class ProductSummaryDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Peça de Usinagem CNC',
  })
  name: string;

  @ApiProperty({
    description: 'Slug do produto',
    example: 'peca-usinagem-cnc',
  })
  slug: string;
}

export class InventoryDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: 'ID do armazém',
    example: 1,
  })
  warehouseId: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 100,
  })
  quantity: number;

  @ApiProperty({
    description: 'Dados do produto',
    type: ProductSummaryDto,
    required: false,
  })
  product?: ProductSummaryDto;

  @ApiProperty({
    description: 'Dados do armazém',
    type: WarehouseDto,
    required: false,
  })
  warehouse?: WarehouseDto;
}

