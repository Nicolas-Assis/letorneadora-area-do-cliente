import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesController } from './controllers/product-images.controller';
import { ProductImagesService } from './services/product-images.service';
import { ProductImageFactory } from './factories/product-image.factory';
import { ProductImage } from '../entities/product-image.entity';
import { Product } from '../entities/product.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage, Product]),
    StorageModule,
  ],
  controllers: [ProductImagesController],
  providers: [ProductImagesService, ProductImageFactory],
  exports: [ProductImagesService, ProductImageFactory],
})
export class ProductImagesModule {}

