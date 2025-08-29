import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../api/entities/product.entity';
import { ProductCategory } from '../api/entities/product-category.entity';
import { CreateProductDto } from '../api/dto/product/create-product.dto';
import { UpdateProductDto } from '../api/dto/product/update-product.dto';
import { FilterProductsDto } from '../api/dto/product/filter-product.dto';
import { ProductDto } from '../api/dto/product/product.dto';
import { ProductFactory } from '../factories/product.factory';
import { PaginationQueryDto } from '../api/dto/common.dto';
// import { createPaginationMeta } from '@/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    private readonly productFactory: ProductFactory,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductDto> {
    // Verificar se já existe produto com o mesmo nome
    const existingProduct = await this.productRepository.findOne({
      where: { name: dto.name },
    });

    if (existingProduct) {
      throw new BadRequestException('Já existe um produto com este nome');
    }

    // Verificar se slug já existe (se fornecido)
    if (dto.slug) {
      const existingSlug = await this.productRepository.findOne({
        where: { slug: dto.slug },
      });

      if (existingSlug) {
        throw new BadRequestException('Já existe um produto com este slug');
      }
    }

    const product = this.productFactory.createProductFromDto(dto);
    const savedProduct = await this.productRepository.save(product);
    function createPaginationMeta(page: number, limit: number, total: number) {
      return { page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    // Associar categorias se fornecidas
    if (Array.isArray(dto.categoryIds) && dto.categoryIds.length > 0) {
      await this.associateCategories(savedProduct.id, dto.categoryIds);
    }

    return this.findOneById(savedProduct.id);
  }

  async findAll(filter: FilterProductsDto): Promise<PaginationQueryDto> {
    const {
      page = 1,
      limit = 10,
      search,
      active,
      available,
      // categoryIds,
      // includeCategories,
      // includeImages,
      sort,
      order,
    } = filter;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Aplicar filtros
    if (search) {
      queryBuilder.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (active !== undefined) {
      queryBuilder.andWhere('product.active = :active', { active });
    }

    if (available !== undefined) {
      queryBuilder.andWhere('product.available = :available', { available });
    }

    // if (categoryIds && categoryIds.length > 0) {
    //   queryBuilder
    //     .innerJoin('product.productCategories', 'pc')
    //     .andWhere('pc.categoryId IN (:...categoryIds)', { categoryIds });
    // }

    // // Incluir relações se solicitado
    // if (includeCategories) {
    //   queryBuilder
    //     .leftJoinAndSelect('product.productCategories', 'productCategories')
    //     .leftJoinAndSelect('productCategories.category', 'category');
    // }

    // if (includeImages) {
    //   queryBuilder.leftJoinAndSelect('product.productImages', 'productImages');
    // }
    const sortField = sort || 'createdAt';
    const sortOrder = order || 'DESC';
    queryBuilder.orderBy(`product.${sortField}`, sortOrder);

    // Paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    const productDtos = this.productFactory.toDTOList(products);
    const meta = this.createPaginationMeta(page, limit, total);

    return {
      page,
      pageSize: limit,
    };
  }

  private createPaginationMeta(page: number, limit: number, total: number) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneById(id: number, includeRelations = true): Promise<ProductDto> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id });

    if (includeRelations) {
      queryBuilder
        .leftJoinAndSelect('product.productCategories', 'productCategories')
        .leftJoinAndSelect('productCategories.category', 'category')
        .leftJoinAndSelect('product.productImages', 'productImages');
    }

    const product = await queryBuilder.getOne();

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.productFactory.toDTO(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se nome já existe (se sendo alterado)
    if (dto.name && dto.name !== product.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: dto.name },
      });

      if (existingProduct) {
        throw new BadRequestException('Já existe um produto com este nome');
      }
    }

    // Verificar se slug já existe (se sendo alterado)
    if (dto.slug && dto.slug !== product.slug) {
      const existingSlug = await this.productRepository.findOne({
        where: { slug: dto.slug },
      });

      if (existingSlug) {
        throw new BadRequestException('Já existe um produto com este slug');
      }
    }

    // Atualizar campos
    Object.assign(product, dto);

    // Gerar slug se nome foi alterado mas slug não foi fornecido
    if (dto.name && !dto.slug) {
      product.slug = this.generateSlug(dto.name);
    }

    await this.productRepository.save(product);

    // Atualizar categorias se fornecidas
    if (dto.categoryIds !== undefined) {
      const categoryIdsArray = Array.isArray(dto.categoryIds) ? dto.categoryIds : [dto.categoryIds];
      await this.updateCategories(id, categoryIdsArray);
    }

    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.productRepository.remove(product);
  }

  private async associateCategories(productId: number, categoryIds: number[]): Promise<void> {
    const productCategories = categoryIds.map((categoryId) => ({
      productId,
      categoryId,
    }));

//    await this.productCategoryRepository.save(productCategories);
  }

  private async updateCategories(productId: number, categoryIds: number[]): Promise<void> {
    // Remover associações existentes
//    await this.productCategoryRepository.delete({ productId });

    // Adicionar novas associações
    if (categoryIds.length > 0) {
      await this.associateCategories(productId, categoryIds);
    }
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
