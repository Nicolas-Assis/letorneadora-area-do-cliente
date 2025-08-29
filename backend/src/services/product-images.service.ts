// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ProductImage } from '../../entities/product-image.entity';
// import { Product } from '../../entities/product.entity';
// import { UploadProductImageDto } from '../api/dto/product-image/upload-product-image.dto';
// import { FilterProductImagesDto } from '../api/dto/product-image/filter-product-images.dto';
// import { ProductImageDto } from '../api/dto/product-image/product-image.dto';
// import { ProductImageFactory } from '../factories/product-image.factory';
// import { StorageService } from './storage.service';
// import { PaginatedResponseDto } from '../../common/dto/base-response.dto';

// @Injectable()
// export class ProductImagesService {
//   constructor(
//     @InjectRepository(ProductImage)
//     private readonly productImageRepository: Repository<ProductImage>,
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,
//     private readonly productImageFactory: ProductImageFactory,
//     private readonly storageService: StorageService,
//   ) {}

//   async upload(file: Express.Multer.File, dto: UploadProductImageDto): Promise<ProductImageDto> {
//     // Verificar se produto existe
//     const product = await this.productRepository.findOne({
//       where: { id: dto.productId },
//     });

//     if (!product) {
//       throw new NotFoundException('Produto não encontrado');
//     }

//     // Se for imagem principal, remover flag de outras imagens
//     if (dto.isPrimary) {
//       await this.productImageRepository.update(
//         { productId: dto.productId, isPrimary: true },
//         { isPrimary: false },
//       );
//     }

//     // Fazer upload da imagem
//     const uploadResult = await this.storageService.uploadImage(file, 'products');

//     // Criar registro no banco
//     const productImage = this.productImageFactory.createProductImageFromUpload(
//       dto.productId,
//       uploadResult,
//       dto.isPrimary,
//     );

//     const savedImage = await this.productImageRepository.save(productImage);

//     return this.productImageFactory.toDTO(savedImage);
//   }

//   async findAll(filter: FilterProductImagesDto): Promise<PaginatedResponseDto<ProductImageDto>> {
//     const { page = 1, limit = 10, productId, isPrimary } = filter;

//     const queryBuilder = this.productImageRepository.createQueryBuilder('productImage');

//     // Aplicar filtros
//     if (productId !== undefined) {
//       queryBuilder.andWhere('productImage.productId = :productId', { productId });
//     }

//     if (isPrimary !== undefined) {
//       queryBuilder.andWhere('productImage.isPrimary = :isPrimary', { isPrimary });
//     }

//     // Ordenação
//     const sortField = filter.sort || 'createdAt';
//     const sortOrder = filter.order || 'DESC';
//     queryBuilder.orderBy(`productImage.${sortField}`, sortOrder);

//     // Paginação
//     const skip = (page - 1) * limit;
//     queryBuilder.skip(skip).take(limit);

//     const [productImages, total] = await queryBuilder.getManyAndCount();

//     const imageDtos = this.productImageFactory.toDTOList(productImages);

//     return new PaginatedResponseDto(
//       true,
//       'Imagens recuperadas com sucesso',
//       imageDtos,
//       page,
//       limit,
//       total,
//     );
//   }

//   async findOneById(id: number): Promise<ProductImageDto> {
//     const productImage = await this.productImageRepository.findOne({
//       where: { id },
//     });

//     if (!productImage) {
//       throw new NotFoundException('Imagem não encontrada');
//     }

//     return this.productImageFactory.toDTO(productImage);
//   }

//   async setPrimary(id: number): Promise<ProductImageDto> {
//     const productImage = await this.productImageRepository.findOne({
//       where: { id },
//     });

//     if (!productImage) {
//       throw new NotFoundException('Imagem não encontrada');
//     }

//     // Remover flag de outras imagens do mesmo produto
//     await this.productImageRepository.update(
//       { productId: productImage.productId, isPrimary: true },
//       { isPrimary: false },
//     );

//     // Definir esta imagem como principal
//     productImage.isPrimary = true;
//     await this.productImageRepository.save(productImage);

//     return this.productImageFactory.toDTO(productImage);
//   }

//   async remove(id: number): Promise<void> {
//     const productImage = await this.productImageRepository.findOne({
//       where: { id },
//     });

//     if (!productImage) {
//       throw new NotFoundException('Imagem não encontrada');
//     }

//     // Remover arquivo do storage
//     try {
//       await this.storageService.deleteImage(productImage.storagePath);
//     } catch (error) {
//       // Log do erro mas não falha a operação
//       console.warn('Erro ao remover arquivo do storage:', error);
//     }

//     // Remover registro do banco
//     await this.productImageRepository.remove(productImage);
//   }

//   async removeByProductId(productId: number): Promise<void> {
//     const productImages = await this.productImageRepository.find({
//       where: { productId },
//     });

//     for (const productImage of productImages) {
//       try {
//         await this.storageService.deleteImage(productImage.storagePath);
//       } catch (error) {
//         console.warn('Erro ao remover arquivo do storage:', error);
//       }
//     }

//     await this.productImageRepository.delete({ productId });
//   }
// }
