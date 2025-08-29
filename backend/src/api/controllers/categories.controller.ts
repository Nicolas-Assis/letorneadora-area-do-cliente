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
import { CategoriesService } from '../../services/categories.service';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { FilterCategoriesDto } from '../dto/category/filter-categories.dto';
import { CategoryDto } from '../dto/category/category.dto';
import { PaginationQueryDto } from '../dto/common.dto';
// import { Roles } from '../../auth/decorators/roles.decorator';
// import { RolesGuard } from '../../auth/guards/roles.guard';
// import { Role } from '../../auth/enums/role.enum';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou categoria já existe',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  // async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
  //   return this.categoriesService.create(createCategoryDto);
  // }
  @Get()
  @ApiOperation({ summary: 'Listar categorias com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias recuperada com sucesso',
    type: PaginationQueryDto,
  })
  async findAll(@Query() filter: FilterCategoriesDto): Promise<PaginationQueryDto> {
    return this.categoriesService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  // async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryDto> {
  //   return this.categoriesService.findOneById(id);
  // }
  @Patch(':id')
  // // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: CategoryDto,
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
    description: 'Categoria não encontrada',
  })
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ): Promise<CategoryDto> {
  //   return this.categoriesService.update(id, updateCategoryDto);
  // }
  @Delete(':id')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria removida com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Categoria possui subcategorias ou produtos associados',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas ADMIN pode remover categorias',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
