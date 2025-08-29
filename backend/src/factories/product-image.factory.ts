// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ProductImage } from '../../entities/product-image.entity';
// import { ProductImageDto } from '../api/dto/product-image/product-image.dto';
// import { UploadResult } from '../services/storage.service';

// @Injectable()
// export class ProductImageFactory {
//   constructor(private configService: ConfigService) {}

//   createProductImageFromUpload(
//     productId: number,
//     uploadResult: UploadResult,
//     isPrimary = false,
//   ): ProductImage {
//     const productImage = new ProductImage();

//     productImage.productId = productId;
//     productImage.storagePath = uploadResult.path;
//     productImage.isPrimary = isPrimary;

//     return productImage;
//   }

//   toDTO(productImage: ProductImage): ProductImageDto {
//     const dto = new ProductImageDto();

//     dto.id = productImage.id;
//     dto.productId = productImage.productId;
//     dto.storagePath = productImage.storagePath;
//     dto.publicUrl = this.getPublicUrl(productImage.storagePath);
//     dto.isPrimary = productImage.isPrimary;
//     dto.createdAt = productImage.createdAt;

//     return dto;
//   }

//   toDTOList(productImages: ProductImage[]): ProductImageDto[] {
//     return productImages.map((productImage) => this.toDTO(productImage));
//   }

//   private getPublicUrl(storagePath: string): string {
//     const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
//     const bucket = this.configService.get<string>('SUPABASE_STORAGE_BUCKET', 'products');

//     return `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
//   }
// }
