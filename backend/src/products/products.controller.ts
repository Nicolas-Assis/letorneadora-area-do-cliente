import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../common/dto/base-response.dto';
import { Product, ProductCategory } from '../common/entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Listar produtos',
    description: 'Retorna uma lista paginada de produtos com filtros opcionais'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de produtos retornada com sucesso',
    type: PaginatedResponseDto<Product>
  })
  async findAll(@Query() queryDto: QueryProductsDto): Promise<PaginatedResponseDto<Product>> {
    return await this.productsService.findAll(queryDto);
  }

  @Get('categories')
  @ApiOperation({ 
    summary: 'Listar categorias de produtos',
    description: 'Retorna todas as categorias ativas de produtos'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de categorias retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Categorias encontradas com sucesso' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductCategory' }
        },
        timestamp: { type: 'string' }
      }
    }
  })
  async findCategories(): Promise<BaseResponseDto<ProductCategory[]>> {
    const categories = await this.productsService.findCategories();
    return BaseResponseDto.success('Categorias encontradas com sucesso', categories);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Obter estatísticas de produtos',
    description: 'Retorna estatísticas sobre produtos e categorias'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas obtidas com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Estatísticas obtidas com sucesso' },
        data: {
          type: 'object',
          properties: {
            totalProducts: { type: 'number', example: 25 },
            activeProducts: { type: 'number', example: 23 },
            featuredProducts: { type: 'number', example: 8 },
            categoryStats: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  productCount: { type: 'number' }
                }
              }
            },
            avgPrice: { type: 'number', example: 185.50 },
            avgProductionTime: { type: 'number', example: 6.5 },
            recentProducts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  category: { type: 'string' },
                  price: { type: 'number' },
                  createdAt: { type: 'string' }
                }
              }
            }
          }
        },
        timestamp: { type: 'string' }
      }
    }
  })
  async getStats(): Promise<BaseResponseDto> {
    const stats = await this.productsService.getProductStats();
    return BaseResponseDto.success('Estatísticas obtidas com sucesso', stats);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obter produto por ID',
    description: 'Retorna os detalhes de um produto específico'
  })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 'prod_123' })
  @ApiResponse({ 
    status: 200, 
    description: 'Produto encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Produto encontrado com sucesso' },
        data: { $ref: '#/components/schemas/Product' },
        timestamp: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Produto não encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Produto com ID prod_123 não encontrado' },
        timestamp: { type: 'string' }
      }
    }
  })
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<Product>> {
    const product = await this.productsService.findOne(id);
    return BaseResponseDto.success('Produto encontrado com sucesso', product);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Criar novo produto',
    description: 'Cria um novo produto no catálogo'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Produto criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Produto criado com sucesso' },
        data: { $ref: '#/components/schemas/Product' },
        timestamp: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Dados de entrada inválidos' },
        errors: { type: 'array', items: { type: 'string' } },
        timestamp: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoria não encontrada',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Categoria com ID cat_123 não encontrada' },
        timestamp: { type: 'string' }
      }
    }
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<BaseResponseDto<Product>> {
    const product = await this.productsService.create(createProductDto);
    return BaseResponseDto.success('Produto criado com sucesso', product);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar produto',
    description: 'Atualiza os dados de um produto existente'
  })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 'prod_123' })
  @ApiResponse({ 
    status: 200, 
    description: 'Produto atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Produto atualizado com sucesso' },
        data: { $ref: '#/components/schemas/Product' },
        timestamp: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Produto não encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Produto com ID prod_123 não encontrado' },
        timestamp: { type: 'string' }
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<BaseResponseDto<Product>> {
    const product = await this.productsService.update(id, updateProductDto);
    return BaseResponseDto.success('Produto atualizado com sucesso', product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Remover produto',
    description: 'Remove um produto do catálogo'
  })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 'prod_123' })
  @ApiResponse({ 
    status: 204, 
    description: 'Produto removido com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Produto não encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Produto com ID prod_123 não encontrado' },
        timestamp: { type: 'string' }
      }
    }
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.productsService.remove(id);
  }
}

