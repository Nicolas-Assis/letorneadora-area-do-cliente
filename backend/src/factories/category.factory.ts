import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../api/entities/category.entity';
import { CategoryDto } from '../api/dto/category/category.dto';
import { CreateCategoryDto } from '../api/dto/category/create-category.dto';

export type CategoryFactoryOptions = {
  name?: string;
  slug?: string;
  parent?: Category | null;
  children?: Category[];
  productCategories?: any[];
  createdAt?: Date;
  id?: number;
};

@Injectable()
export class CategoryFactory {
  buildCategory(opts: CategoryFactoryOptions = {}): Category {
    const category = new Category();

    const name = opts.name ?? `Category ${Math.random().toString(36).slice(2, 8)}`;
    category.name = name;
    category.slug =
      opts.slug ??
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    // entity allows nullable parent in DB; use null when not provided
    (category as any).parent = opts.parent ?? null;
    category.children = opts.children ?? [];
    category.productCategories = opts.productCategories ?? [];
    category.createdAt = opts.createdAt ?? new Date();

    if (typeof opts.id === 'number') {
      // assign only if explicitly provided (useful for tests)
      (category as any).id = opts.id;
    }

    return category;
  }

  async createCategory(
    repo?: Repository<Category> | null,
    opts: CategoryFactoryOptions = {},
  ): Promise<Category> {
    const category = this.buildCategory(opts);

    if (repo) {
      return repo.save(category);
    }

    return category;
  }

  createCategoryFromDto(dto: CreateCategoryDto): Category {
    const category = new Category();
    category.name = dto.name;
    category.slug = dto.slug || this.generateSlug(dto.name);
    // If DTO supplies parentId, caller should resolve parent entity; keep null by default
    (category as any).parent = (dto as any).parent ?? null;
    category.children = [];
    category.productCategories = [];
    return category;
  }

  toDTO(category: Category): CategoryDto {
    const dto = new CategoryDto();
    dto.id = category.id;
    dto.name = category.name;
    dto.slug = category.slug;
    dto.createdAt = category.createdAt;
    // map parentId if parent exists
    // dto.parentId = category.parent ? (category.parent as any).id : undefined;
    // // map children ids
    // dto.childIds = category.children?.map((c) => c.id) ?? [];
    return dto;
  }

  toDTOList(categories: Category[]): CategoryDto[] {
    return categories.map((c) => this.toDTO(c));
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // spaces to hyphens
      .replace(/-+/g, '-') // collapse hyphens
      .trim();
  }
}
