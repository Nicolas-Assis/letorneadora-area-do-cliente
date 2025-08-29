import { Injectable } from '@nestjs/common';
import { Product } from '../../entities/product.entity';
import { ProductDto, CategoryDto, ProductImageDto } from '../dto/product.dto';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductFactory {
  createProductFromDto(dto: CreateProductDto): Product {
    const product = new Product();
    
    product.name = dto.name;
    product.description = dto.description;
    product.slug = dto.slug || this.generateSlug(dto.name);
    product.active = dto.active ?? true;
    product.available = dto.available ?? true;
    product.minStock = dto.minStock;
    
    return product;
  }

  toDTO(product: Product): ProductDto {
    const dto = new ProductDto();
    
    dto.id = product.id;
    dto.name = product.name;
    dto.description = product.description;
    dto.slug = product.slug;
    dto.active = product.active;
    dto.available = product.available;
    dto.minStock = product.minStock;
    dto.createdAt = product.createdAt;
    dto.updatedAt = product.updatedAt;

    // Mapear categorias se existirem
    if (product.productCategories && product.productCategories.length > 0) {
      dto.categories = product.productCategories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      } as CategoryDto));
    }

    // Mapear imagens se existirem
    if (product.productImages && product.productImages.length > 0) {
      dto.images = product.productImages.map(pi => ({
        id: pi.id,
        storagePath: pi.storagePath,
        isPrimary: pi.isPrimary,
        createdAt: pi.createdAt,
      } as ProductImageDto));
    }

    return dto;
  }

  toDTOList(products: Product[]): ProductDto[] {
    return products.map(product => this.toDTO(product));
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();
  }
}

