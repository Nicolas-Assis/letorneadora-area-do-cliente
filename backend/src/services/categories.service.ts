import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryFactory } from 'src/factories/category.factory';
import { Category } from 'src/api/entities/category.entity';
import { FilterCategoriesDto } from 'src/api/dto/category/filter-categories.dto';
import { PaginationQueryDto } from 'src/api/dto/common.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly categoryFactory: CategoryFactory, // <-- tipo explícito / token reconhecível
  ) {}

  // async create(dto: CreateCategoryDto): Promise<CategoryDto> {
  //   // Verificar se já existe categoria com o mesmo nome
  //   const existingCategory = await this.categoryRepository.findOne({
  //     where: { name: dto.name },
  //   });

  //   if (existingCategory) {
  //     throw new BadRequestException('Já existe uma categoria com este nome');
  //   }

  //   // Verificar se slug já existe (se fornecido)
  //   if (dto.slug) {
  //     const existingSlug = await this.categoryRepository.findOne({
  //       where: { slug: dto.slug },
  //     });

  //     if (existingSlug) {
  //       throw new BadRequestException('Já existe uma categoria com este slug');
  //     }
  //   }

  //   // Verificar se categoria pai existe (se fornecida)
  //   if (dto.parentId) {
  //     const parentCategory = await this.categoryRepository.findOne({
  //       where: { id: dto.parentId },
  //     });

  //     if (!parentCategory) {
  //       throw new BadRequestException('Categoria pai não encontrada');
  //     }
  //   }

  //   const category = this.categoryFactory.createCategoryFromDto(dto);

  //   if (dto.parentId) {
  //     category.parent = { id: dto.parentId } as Category;
  //   }

  //   const savedCategory = await this.categoryRepository.save(category);

  //   return this.findOneById(savedCategory.id);
  // }

  async findAll(filter: FilterCategoriesDto): Promise<PaginationQueryDto> {
    const {
      // page = 1,
      // limit = 10,
      search,
      parentId,
      rootOnly,
      includeChildren,
      includeParent,
      includeProductCount,
    } = filter;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    // Aplicar filtros
    if (search) {
      queryBuilder.andWhere('category.name ILIKE :search', { search: `%${search}%` });
    }

    if (parentId !== undefined) {
      queryBuilder.andWhere('category.parent.id = :parentId', { parentId });
    }

    if (rootOnly) {
      queryBuilder.andWhere('category.parent IS NULL');
    }

    // Incluir relações se solicitado
    if (includeParent) {
      queryBuilder.leftJoinAndSelect('category.parent', 'parent');
    }

    if (includeChildren) {
      queryBuilder.leftJoinAndSelect('category.children', 'children');
    }

    if (includeProductCount) {
      queryBuilder.leftJoinAndSelect('category.productCategories', 'productCategories');
    }

    // Ordenação
    // const sortField = filter.sort || 'name';
    // const sortOrder = filter.order || 'ASC';
    // queryBuilder.orderBy(`category.${sortField}`, sortOrder);

    // Paginação
    // const skip = (page - 1) * limit;
    // queryBuilder.skip(skip).take(limit);

    // const [categories, total] = await queryBuilder.getManyAndCount();

    // const categoryDtos = this.categoryFactory.toDTOList(
    //   categories,
    //   includeChildren || includeParent || includeProductCount,
    // );

    // return new PaginatedResponseDto();
    // true,
    // 'Categorias recuperadas com sucesso',
    // categoryDtos,
    // page,
    // limit,
    // total,

    // Temporary fix: return an empty PaginationQueryDto object
    return new PaginationQueryDto();
  }

  // async findOneById(id: number, includeRelations = true): Promise<CategoryDto> {
  //   const queryBuilder = this.categoryRepository
  //     .createQueryBuilder('category')
  //     .where('category.id = :id', { id });

  //   if (includeRelations) {
  //     queryBuilder
  //       .leftJoinAndSelect('category.parent', 'parent')
  //       .leftJoinAndSelect('category.children', 'children')
  //       .leftJoinAndSelect('category.productCategories', 'productCategories');
  //   }

  //   const category = await queryBuilder.getOne();

  //   if (!category) {
  //     throw new NotFoundException('Categoria não encontrada');
  //   }

  //   return this.categoryFactory.toDTO(category, includeRelations);
  // }

  // async update(id: number, dto: UpdateCategoryDto): Promise<CategoryDto> {
  //   const category = await this.categoryRepository.findOne({
  //     where: { id },
  //     relations: ['parent'],
  //   });

  //   if (!category) {
  //     throw new NotFoundException('Categoria não encontrada');
  //   }

  //   // Verificar se nome já existe (se sendo alterado)
  //   if (dto.name && dto.name !== category.name) {
  //     const existingCategory = await this.categoryRepository.findOne({
  //       where: { name: dto.name },
  //     });

  //     if (existingCategory) {
  //       throw new BadRequestException('Já existe uma categoria com este nome');
  //     }
  //   }

  //   // Verificar se slug já existe (se sendo alterado)
  //   if (dto.slug && dto.slug !== category.slug) {
  //     const existingSlug = await this.categoryRepository.findOne({
  //       where: { slug: dto.slug },
  //     });

  //     if (existingSlug) {
  //       throw new BadRequestException('Já existe uma categoria com este slug');
  //     }
  //   }

  //   // Verificar se categoria pai existe (se sendo alterada)
  //   if (dto.parentId !== undefined) {
  //     if (dto.parentId === id) {
  //       throw new BadRequestException('Uma categoria não pode ser pai de si mesma');
  //     }

  //     if (dto.parentId) {
  //       const parentCategory = await this.categoryRepository.findOne({
  //         where: { id: dto.parentId },
  //       });

  //       if (!parentCategory) {
  //         throw new BadRequestException('Categoria pai não encontrada');
  //       }

  //       // Verificar se não criaria um loop
  //       if (await this.wouldCreateLoop(id, dto.parentId)) {
  //         throw new BadRequestException(
  //           'Esta operação criaria um loop na hierarquia de categorias',
  //         );
  //       }

  //       category.parent = parentCategory;
  //     } else {
  //       category.parent = null;
  //     }
  //   }

  //   // Atualizar campos
  //   if (dto.name) {
  //     category.name = dto.name;
  //   }

  //   // if (dto.slug) {
  //   //   category.slug = dto.slug;
  //   // } else if (dto.name && !dto.slug) {
  //   //   category.slug = this.generateSlug(dto.name);
  //   // }

  //   // await this.categoryRepository.save(category);

  //   // return this.findOneById(id);
  // }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['children', 'productCategories'],
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar se tem subcategorias
    if (category.children && category.children.length > 0) {
      throw new BadRequestException(
        'Não é possível remover uma categoria que possui subcategorias',
      );
    }

    // Verificar se tem produtos associados
    if (category.productCategories && category.productCategories.length > 0) {
      throw new BadRequestException(
        'Não é possível remover uma categoria que possui produtos associados',
      );
    }

    await this.categoryRepository.remove(category);
  }

  private async wouldCreateLoop(categoryId: number, newParentId: number): Promise<boolean> {
    let currentParentId = newParentId;

    while (currentParentId) {
      if (currentParentId === categoryId) {
        return true;
      }

      const parent = await this.categoryRepository.findOne({
        where: { id: currentParentId },
        relations: ['parent'],
      });

      currentParentId = parent?.parent?.id;
    }

    return false;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
