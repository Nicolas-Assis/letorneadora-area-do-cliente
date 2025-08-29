import { Injectable } from '@nestjs/common';
import { Category } from '../../entities/category.entity';
import { CategoryDto } from '../dto/category.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryFactory {
  createCategoryFromDto(dto: CreateCategoryDto): Category {
    const category = new Category();
    
    category.name = dto.name;
    category.slug = dto.slug || this.generateSlug(dto.name);
    
    return category;
  }

  toDTO(category: Category, includeRelations = false): CategoryDto {
    const dto = new CategoryDto();
    
    dto.id = category.id;
    dto.name = category.name;
    dto.slug = category.slug;
    dto.createdAt = category.createdAt;

    if (includeRelations) {
      // Incluir categoria pai se existir
      if (category.parent) {
        dto.parent = this.toDTO(category.parent, false);
      }

      // Incluir subcategorias se existirem
      if (category.children && category.children.length > 0) {
        dto.children = category.children.map(child => this.toDTO(child, false));
      }

      // Incluir contagem de produtos se disponível
      if (category.productCategories) {
        dto.productCount = category.productCategories.length;
      }
    }

    return dto;
  }

  toDTOList(categories: Category[], includeRelations = false): CategoryDto[] {
    return categories.map(category => this.toDTO(category, includeRelations));
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

