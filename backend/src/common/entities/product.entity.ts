import { ApiProperty } from '@nestjs/swagger';

export class ProductCategory {
  @ApiProperty({
    description: 'ID único da categoria',
    example: 'cat_123',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Usinagem CNC',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Peças usinadas com precisão em torno CNC',
  })
  description: string;

  @ApiProperty({
    description: 'URL da imagem da categoria',
    example: 'https://example.com/images/categoria.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Indica se a categoria está ativa',
    example: true,
  })
  active: boolean;

  constructor(partial: Partial<ProductCategory>) {
    Object.assign(this, partial);
  }
}

export class Product {
  @ApiProperty({
    description: 'ID único do produto',
    example: 'prod_123',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Peça Usinada em Alumínio',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada do produto',
    example: 'Peça usinada em alumínio 6061 com acabamento anodizado, ideal para aplicações automotivas.',
  })
  description: string;

  @ApiProperty({
    description: 'Categoria do produto',
    type: ProductCategory,
  })
  category: ProductCategory;

  @ApiProperty({
    description: 'Preço base do produto (para referência)',
    example: 150.50,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: 'URL da imagem principal do produto',
    example: 'https://example.com/images/produto.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'URLs de imagens adicionais',
    example: ['https://example.com/images/produto2.jpg', 'https://example.com/images/produto3.jpg'],
    required: false,
  })
  additionalImages?: string[];

  @ApiProperty({
    description: 'Especificações técnicas do produto',
    example: {
      material: 'Alumínio 6061',
      acabamento: 'Anodizado',
      tolerancia: '±0.1mm',
      peso: '250g'
    },
    required: false,
  })
  specifications?: Record<string, any>;

  @ApiProperty({
    description: 'Tags para facilitar a busca',
    example: ['usinagem', 'aluminio', 'automotivo', 'precisao'],
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: 'Indica se o produto está ativo',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Indica se o produto está em destaque',
    example: false,
  })
  featured: boolean;

  @ApiProperty({
    description: 'Tempo estimado de produção em dias',
    example: 7,
    required: false,
  })
  productionTime?: number;

  @ApiProperty({
    description: 'Data de criação do produto',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-20T15:45:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}

