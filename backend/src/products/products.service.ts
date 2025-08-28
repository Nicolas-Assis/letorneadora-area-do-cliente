import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { Product, ProductCategory } from '../common/entities/product.entity';
import { PaginatedResponseDto } from '../common/dto/base-response.dto';

@Injectable()
export class ProductsService {
  // Simulação de categorias em memória
  private categories: ProductCategory[] = [
    new ProductCategory({
      id: 'cat_1',
      name: 'Usinagem CNC',
      description: 'Peças usinadas com precisão em torno e fresadora CNC',
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
      active: true,
    }),
    new ProductCategory({
      id: 'cat_2',
      name: 'Torneamento',
      description: 'Peças torneadas em diversos materiais',
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
      active: true,
    }),
    new ProductCategory({
      id: 'cat_3',
      name: 'Fresamento',
      description: 'Peças fresadas com acabamento de alta qualidade',
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
      active: true,
    }),
    new ProductCategory({
      id: 'cat_4',
      name: 'Soldagem',
      description: 'Serviços de soldagem especializada',
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
      active: true,
    }),
  ];

  // Simulação de produtos em memória
  private products: Product[] = [
    new Product({
      id: 'prod_1',
      name: 'Peça Usinada em Alumínio 6061',
      description: 'Peça usinada em alumínio 6061 com acabamento anodizado, ideal para aplicações automotivas que exigem alta precisão e resistência à corrosão.',
      category: this.categories[0],
      price: 150.50,
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
      additionalImages: [
        'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop&crop=left'
      ],
      specifications: {
        material: 'Alumínio 6061-T6',
        acabamento: 'Anodizado natural',
        tolerancia: '±0.05mm',
        peso: '250g',
        dureza: '95 HB'
      },
      tags: ['usinagem', 'aluminio', 'automotivo', 'precisao', 'anodizado'],
      active: true,
      featured: true,
      productionTime: 7,
      createdAt: new Date('2024-01-15T10:30:00.000Z'),
      updatedAt: new Date('2024-01-20T15:45:00.000Z'),
    }),
    new Product({
      id: 'prod_2',
      name: 'Eixo Torneado em Aço 1045',
      description: 'Eixo torneado em aço carbono 1045, com tratamento térmico para maior resistência mecânica. Ideal para aplicações industriais.',
      category: this.categories[1],
      price: 89.90,
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
      specifications: {
        material: 'Aço 1045',
        tratamento: 'Têmpera e revenimento',
        tolerancia: '±0.02mm',
        peso: '1.2kg',
        dureza: '28-32 HRC'
      },
      tags: ['torneamento', 'aco', 'industrial', 'eixo', 'tratamento'],
      active: true,
      featured: false,
      productionTime: 5,
      createdAt: new Date('2024-01-16T14:20:00.000Z'),
      updatedAt: new Date('2024-01-22T09:30:00.000Z'),
    }),
    new Product({
      id: 'prod_3',
      name: 'Flange Fresado em Aço Inox 316',
      description: 'Flange fresado em aço inoxidável 316L, com acabamento polido e resistência à corrosão. Perfeito para indústria alimentícia e química.',
      category: this.categories[2],
      price: 320.00,
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
      specifications: {
        material: 'Aço Inox 316L',
        acabamento: 'Polido espelho',
        tolerancia: '±0.1mm',
        peso: '2.8kg',
        rugosidade: 'Ra 0.8'
      },
      tags: ['fresamento', 'inox', 'alimenticio', 'flange', 'polido'],
      active: true,
      featured: true,
      productionTime: 10,
      createdAt: new Date('2024-01-18T11:45:00.000Z'),
      updatedAt: new Date('2024-01-25T16:20:00.000Z'),
    }),
    new Product({
      id: 'prod_4',
      name: 'Suporte Soldado em Aço Carbono',
      description: 'Suporte estrutural soldado em aço carbono, com pintura eletrostática. Ideal para equipamentos industriais e estruturas metálicas.',
      category: this.categories[3],
      price: 75.00,
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
      specifications: {
        material: 'Aço carbono SAE 1020',
        soldagem: 'MIG/MAG',
        acabamento: 'Pintura eletrostática',
        peso: '3.5kg',
        carga: '500kg'
      },
      tags: ['soldagem', 'estrutural', 'suporte', 'pintura', 'industrial'],
      active: true,
      featured: false,
      productionTime: 3,
      createdAt: new Date('2024-01-20T08:15:00.000Z'),
      updatedAt: new Date('2024-01-24T13:40:00.000Z'),
    }),
    new Product({
      id: 'prod_5',
      name: 'Engrenagem Usinada em Bronze',
      description: 'Engrenagem usinada em bronze fosforoso, com dentes precisos e acabamento fino. Aplicação em redutores e transmissões.',
      category: this.categories[0],
      price: 450.00,
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
      specifications: {
        material: 'Bronze fosforoso',
        modulo: '2.5',
        dentes: '24',
        tolerancia: 'DIN 6',
        peso: '800g'
      },
      tags: ['usinagem', 'bronze', 'engrenagem', 'transmissao', 'precisao'],
      active: true,
      featured: true,
      productionTime: 12,
      createdAt: new Date('2024-01-22T15:30:00.000Z'),
      updatedAt: new Date('2024-01-26T10:15:00.000Z'),
    }),
    new Product({
      id: 'prod_6',
      name: 'Bucha Torneada em Latão',
      description: 'Bucha torneada em latão com acabamento polido, ideal para aplicações hidráulicas e pneumáticas que exigem baixo atrito.',
      category: this.categories[1],
      price: 25.50,
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
      specifications: {
        material: 'Latão 60/40',
        acabamento: 'Polido',
        tolerancia: 'H7',
        peso: '150g',
        dureza: '85 HB'
      },
      tags: ['torneamento', 'latao', 'bucha', 'hidraulico', 'polido'],
      active: true,
      featured: false,
      productionTime: 2,
      createdAt: new Date('2024-01-24T12:00:00.000Z'),
      updatedAt: new Date('2024-01-26T14:30:00.000Z'),
    }),
  ];

  async findAll(queryDto: QueryProductsDto): Promise<PaginatedResponseDto<Product>> {
    let filteredProducts = [...this.products];

    // Aplicar filtros
    if (queryDto.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.category.id === queryDto.categoryId);
    }

    if (queryDto.active !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.active === queryDto.active);
    }

    if (queryDto.featured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.featured === queryDto.featured);
    }

    if (queryDto.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price && p.price >= queryDto.minPrice!);
    }

    if (queryDto.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price && p.price <= queryDto.maxPrice!);
    }

    if (queryDto.maxProductionTime !== undefined) {
      filteredProducts = filteredProducts.filter(p => 
        p.productionTime && p.productionTime <= queryDto.maxProductionTime!
      );
    }

    if (queryDto.tags) {
      const searchTags = queryDto.tags.toLowerCase().split(',').map(t => t.trim());
      filteredProducts = filteredProducts.filter(p => 
        p.tags && searchTags.some(tag => 
          p.tags!.some(pTag => pTag.toLowerCase().includes(tag))
        )
      );
    }

    if (queryDto.search) {
      const searchTerm = queryDto.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.name.toLowerCase().includes(searchTerm) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }

    // Aplicar ordenação
    if (queryDto.sortBy) {
      filteredProducts.sort((a, b) => {
        const aValue = this.getNestedValue(a, queryDto.sortBy!);
        const bValue = this.getNestedValue(b, queryDto.sortBy!);
        
        if (queryDto.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Aplicar paginação
    const total = filteredProducts.length;
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;
    
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    return PaginatedResponseDto.create(
      'Produtos encontrados com sucesso',
      paginatedProducts,
      page,
      limit,
      total
    );
  }

  async findOne(id: string): Promise<Product> {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = this.categories.find(c => c.id === createProductDto.categoryId);
    if (!category) {
      throw new NotFoundException(`Categoria com ID ${createProductDto.categoryId} não encontrada`);
    }

    const newProduct = new Product({
      id: `prod_${Date.now()}`,
      ...createProductDto,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    let category = this.products[productIndex].category;
    if (updateProductDto.categoryId) {
      const foundCategory = this.categories.find(c => c.id === updateProductDto.categoryId);
      if (!foundCategory) {
        throw new NotFoundException(`Categoria com ID ${updateProductDto.categoryId} não encontrada`);
      }
      category = foundCategory;
    }

    const updatedProduct = new Product({
      ...this.products[productIndex],
      ...updateProductDto,
      category,
      updatedAt: new Date(),
    });

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    this.products.splice(productIndex, 1);
  }

  async findCategories(): Promise<ProductCategory[]> {
    return this.categories.filter(c => c.active);
  }

  async getProductStats() {
    const totalProducts = this.products.length;
    const activeProducts = this.products.filter(p => p.active).length;
    const featuredProducts = this.products.filter(p => p.featured).length;
    
    const categoryStats = this.categories.map(category => ({
      id: category.id,
      name: category.name,
      productCount: this.products.filter(p => p.category.id === category.id && p.active).length,
    }));

    const avgPrice = this.products
      .filter(p => p.price)
      .reduce((sum, p) => sum + p.price!, 0) / this.products.filter(p => p.price).length;

    const avgProductionTime = this.products
      .filter(p => p.productionTime)
      .reduce((sum, p) => sum + p.productionTime!, 0) / this.products.filter(p => p.productionTime).length;

    return {
      totalProducts,
      activeProducts,
      featuredProducts,
      categoryStats,
      avgPrice: Math.round(avgPrice * 100) / 100,
      avgProductionTime: Math.round(avgProductionTime * 10) / 10,
      recentProducts: this.products
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          category: p.category.name,
          price: p.price,
          createdAt: p.createdAt,
        })),
    };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

