import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    description: 'ID da categoria',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Usinagem',
  })
  name: string;

  @ApiProperty({
    description: 'Slug da categoria',
    example: 'usinagem',
  })
  slug: string;
}

export class ProductImageDto {
  @ApiProperty({
    description: 'ID da imagem',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Caminho de armazenamento da imagem',
    example: 'images/1234567890-uuid.jpg',
  })
  storagePath: string;

  @ApiProperty({
    description: 'Se é a imagem principal',
    example: true,
  })
  isPrimary: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-08-28T19:30:00.000Z',
  })
  createdAt: Date;
}

export class ProductDto {
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
    description: 'Descrição do produto',
    example: 'Peça de alta precisão fabricada em alumínio 6061',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Slug único do produto',
    example: 'peca-usinagem-cnc',
  })
  slug: string;

  @ApiProperty({
    description: 'Se o produto está ativo',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Se o produto está disponível',
    example: true,
  })
  available: boolean;

  @ApiProperty({
    description: 'Estoque mínimo',
    example: 10,
    required: false,
  })
  minStock?: number;

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
    description: 'Categorias do produto',
    type: [CategoryDto],
    required: false,
  })
  categories?: CategoryDto[];

  @ApiProperty({
    description: 'Imagens do produto',
    type: [ProductImageDto],
    required: false,
  })
  images?: ProductImageDto[];
}

