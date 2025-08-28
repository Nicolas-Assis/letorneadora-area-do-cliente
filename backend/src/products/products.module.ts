import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ProductFactory } from './factories/product.factory';
import { Product } from '../entities/product.entity';
import { ProductCategory } from '../entities/product-category.entity';
import { ProductImage } from '../entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCategory,
      ProductImage,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductFactory],
  exports: [ProductsService, ProductFactory],
})
export class ProductsModule {}

