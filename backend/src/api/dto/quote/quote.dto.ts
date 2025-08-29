import { ApiProperty } from '@nestjs/swagger';
// import { QuoteStatus } from '../../entities/quote.entity';

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

export class QuoteItemDto {
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
    example: 150.5,
    required: false,
  })
  unitPrice?: number;

  @ApiProperty({
    description: 'Subtotal do item',
    example: 752.5,
    required: false,
  })
  subtotal?: number;

  @ApiProperty({
    description: 'Dados do produto',
    type: ProductSummaryDto,
    required: false,
  })
  product?: ProductSummaryDto;
}

export class QuoteDto {
  @ApiProperty({
    description: 'ID do orçamento',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do perfil do cliente',
    example: 'uuid-do-cliente',
  })
  profileId: string;

  // @ApiProperty({
  //   description: 'Status do orçamento',
  //   enum: QuoteStatus,
  //   example: QuoteStatus.PENDING,
  // })
  // status: QuoteStatus;

  @ApiProperty({
    description: 'Total do orçamento',
    example: 1500.0,
    required: false,
  })
  total?: number;

  @ApiProperty({
    description: 'Observações do orçamento',
    example: 'Orçamento para peças especiais',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Data de validade do orçamento',
    example: '2024-09-30T23:59:59.000Z',
    required: false,
  })
  validUntil?: Date;

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
    description: 'Itens do orçamento',
    type: [QuoteItemDto],
    required: false,
  })
  items?: QuoteItemDto[];
}
