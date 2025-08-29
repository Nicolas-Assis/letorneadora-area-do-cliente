import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FilterProductsDto } from '../dto/filter-products.dto';
import { ProductDto } from '../dto/product.dto';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/enums/role.enum';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: ProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou produto já existe',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos recuperada com sucesso',
    type: PaginatedResponseDto<ProductDto>,
  })
  async findAll(@Query() filter: FilterProductsDto): Promise<PaginatedResponseDto<ProductDto>> {
    return this.productsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
    type: ProductDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
    return this.productsService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: ProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto removido com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas ADMIN pode remover produtos',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}

