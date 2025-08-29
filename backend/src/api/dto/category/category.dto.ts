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
    description: 'Slug único da categoria',
    example: 'usinagem',
  })
  slug: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-08-28T19:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Categoria pai',
    type: () => CategoryDto,
    required: false,
  })
  parent?: CategoryDto;

  @ApiProperty({
    description: 'Subcategorias',
    type: [CategoryDto],
    required: false,
  })
  children?: CategoryDto[];

  @ApiProperty({
    description: 'Número de produtos nesta categoria',
    example: 15,
    required: false,
  })
  productCount?: number;
}

