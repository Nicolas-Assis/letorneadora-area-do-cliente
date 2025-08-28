import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../entities/order.entity';

export class ProfileSummaryDto {
  @ApiProperty({
    description: 'ID do perfil',
    example: 'uuid-do-cliente',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Telefone do cliente',
    example: '(11) 99999-9999',
    required: false,
  })
  phone?: string;
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

export class OrderItemDto {
  @ApiProperty({
    description: 'ID do item',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: 'Quantidade solicitada',
    example: 5,
  })
  quantity: number;

  @ApiProperty({
    description: 'Preço unitário',
    example: 150.50,
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Subtotal do item',
    example: 752.50,
  })
  subtotal: number;

  @ApiProperty({
    description: 'Dados do produto',
    type: ProductSummaryDto,
    required: false,
  })
  product?: ProductSummaryDto;
}

export class OrderDto {
  @ApiProperty({
    description: 'ID do pedido',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do perfil do cliente',
    example: 'uuid-do-cliente',
  })
  profileId: string;

  @ApiProperty({
    description: 'Status do pedido',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Total do pedido',
    example: 1500.00,
  })
  total: number;

  @ApiProperty({
    description: 'Observações do pedido',
    example: 'Pedido urgente com acabamento especial',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'ID do orçamento relacionado',
    example: 1,
    required: false,
  })
  quoteId?: number;

  @ApiProperty({
    description: 'Data estimada de entrega',
    example: '2024-09-15',
    required: false,
  })
  estimatedDelivery?: Date;

  @ApiProperty({
    description: 'Data de entrega realizada',
    example: '2024-09-14T14:30:00.000Z',
    required: false,
  })
  deliveredAt?: Date;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-08-28T19:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-08-28T19:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Dados do cliente',
    type: ProfileSummaryDto,
    required: false,
  })
  profile?: ProfileSummaryDto;

  @ApiProperty({
    description: 'Itens do pedido',
    type: [OrderItemDto],
    required: false,
  })
  items?: OrderItemDto[];
}

