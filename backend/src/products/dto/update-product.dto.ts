import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // Herda todos os campos de CreateProductDto como opcionais
  // Permite atualizações parciais do produto
}

