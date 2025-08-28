import { ApiProperty } from '@nestjs/swagger';

export class ProductImageDto {
  @ApiProperty({
    description: 'ID da imagem',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: 'Caminho de armazenamento da imagem',
    example: 'images/1234567890-uuid.jpg',
  })
  storagePath: string;

  @ApiProperty({
    description: 'URL pública da imagem',
    example: 'https://supabase.co/storage/v1/object/public/products/images/1234567890-uuid.jpg',
  })
  publicUrl: string;

  @ApiProperty({
    description: 'Se é a imagem principal do produto',
    example: true,
  })
  isPrimary: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-08-28T19:30:00.000Z',
  })
  createdAt: Date;
}

