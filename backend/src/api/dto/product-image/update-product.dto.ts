import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'IDs das categorias do produto',
    example: 1,
    type: Number,
    required: false,
  })
  categoryId?: number[];
}
