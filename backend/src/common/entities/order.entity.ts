import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';
import { User } from './user.entity';

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

export class OrderItem {
  @ApiProperty({
    description: 'ID único do item',
    example: 'item_123',
  })
  id: string;

  @ApiProperty({
    description: 'Produto do item',
    type: Product,
  })
  product: Product;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Preço unitário cotado',
    example: 150.50,
    required: false,
  })
  unitPrice?: number;

  @ApiProperty({
    description: 'Preço total do item',
    example: 301.00,
    required: false,
  })
  totalPrice?: number;

  @ApiProperty({
    description: 'Especificações especiais para este item',
    example: 'Acabamento especial em cromado',
    required: false,
  })
  specifications?: string;

  constructor(partial: Partial<OrderItem>) {
    Object.assign(this, partial);
  }
}

export class Order {
  @ApiProperty({
    description: 'ID único do pedido',
    example: 'order_123',
  })
  id: string;

  @ApiProperty({
    description: 'Número do pedido (sequencial)',
    example: 'PED-2024-001',
  })
  orderNumber: string;

  @ApiProperty({
    description: 'Status atual do pedido',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Cliente que fez o pedido',
    type: User,
    required: false,
  })
  customer?: User;

  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João Silva',
  })
  customerName: string;

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao@example.com',
  })
  customerEmail: string;

  @ApiProperty({
    description: 'Telefone do cliente',
    example: '(11) 99999-9999',
  })
  customerPhone: string;

  @ApiProperty({
    description: 'Nome da empresa do cliente',
    example: 'Empresa LTDA',
    required: false,
  })
  customerCompany?: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90',
    required: false,
  })
  customerCnpj?: string;

  @ApiProperty({
    description: 'Lista de itens do pedido',
    type: [OrderItem],
  })
  items: OrderItem[];

  @ApiProperty({
    description: 'Descrição detalhada do projeto',
    example: 'Preciso de peças usinadas para projeto automotivo. Tolerância crítica de ±0.05mm.',
  })
  description: string;

  @ApiProperty({
    description: 'Prazo desejado para entrega (em dias)',
    example: 15,
    required: false,
  })
  desiredDeadline?: number;

  @ApiProperty({
    description: 'Prazo estimado para entrega (em dias)',
    example: 20,
    required: false,
  })
  estimatedDeadline?: number;

  @ApiProperty({
    description: 'Valor total cotado',
    example: 1500.00,
    required: false,
  })
  totalAmount?: number;

  @ApiProperty({
    description: 'Observações adicionais',
    example: 'Projeto urgente, favor priorizar.',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Observações internas da equipe',
    example: 'Cliente preferencial, dar desconto de 5%.',
    required: false,
  })
  internalNotes?: string;

  @ApiProperty({
    description: 'Data de criação do pedido',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-20T15:45:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Data de aprovação do orçamento',
    example: '2024-01-18T14:20:00.000Z',
    required: false,
  })
  approvedAt?: Date;

  @ApiProperty({
    description: 'Data de entrega',
    example: '2024-02-05T16:00:00.000Z',
    required: false,
  })
  deliveredAt?: Date;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}

