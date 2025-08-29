// import {
//   Controller,
//   Get,
//   Post,
//   Patch,
//   Delete,
//   Param,
//   Query,
//   Body,
//   // UseGuards,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
// import { InventoryService } from '../../services/inventory.service';
// import { CreateInventoryDto } from '../dto/inventory/create-inventory.dto';
// import { UpdateInventoryDto } from '../dto/inventory/update-inventory.dto';
// import { FilterInventoryDto } from '../dto/inventory/filter-inventory.dto';
// import { InventoryDto } from '../dto/inventory/inventory.dto';
// // import { PaginatedResponseDto } from '../../common/dto/base-response.dto';
// // import { Roles } from '../../auth/decorators/roles.decorator';
// // import { RolesGuard } from '../../auth/guards/roles.guard';
// // import { Role } from '../../auth/enums/role.enum'

// @ApiTags('inventory')
// @Controller('inventory')
// export class InventoryController {
//   constructor(private readonly inventoryService: InventoryService) {}

//   @Post()
//   // @UseGuards(RolesGuard)
//   // @Roles(Role.ADMIN, Role.OPERATOR)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Criar novo registro de estoque' })
//   @ApiResponse({
//     status: 201,
//     description: 'Estoque criado com sucesso',
//     type: InventoryDto,
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Dados inválidos ou estoque já existe',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Não autorizado',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Acesso negado - role insuficiente',
//   })
//   async create(@Body() createInventoryDto: CreateInventoryDto): Promise<InventoryDto> {
//     return this.inventoryService.create(createInventoryDto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Listar estoque com filtros e paginação' })
//   @ApiResponse({
//     status: 200,
//     description: 'Lista de estoque recuperada com sucesso',
//     // type: PaginatedResponseDto<InventoryDto>,
//   })
//   async findAll(@Query() filter: FilterInventoryDto): Promise<any> {
//     return this.inventoryService.findAll(filter);
//   }

//   @Get('low-stock')
//   // @UseGuards(RolesGuard)
//   // @Roles(Role.ADMIN, Role.OPERATOR)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Listar produtos com estoque baixo' })
//   @ApiResponse({
//     status: 200,
//     description: 'Lista de produtos com estoque baixo',
//     type: [InventoryDto],
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Não autorizado',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Acesso negado - role insuficiente',
//   })
//   async getLowStockProducts(): Promise<InventoryDto[]> {
//     return this.inventoryService.getLowStockProducts();
//   }

//   @Get(':productId/:warehouseId')
//   @ApiOperation({ summary: 'Buscar estoque específico por produto e armazém' })
//   @ApiResponse({
//     status: 200,
//     description: 'Estoque encontrado',
//     type: InventoryDto,
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Estoque não encontrado',
//   })
//   async findOne(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Param('warehouseId', ParseIntPipe) warehouseId: number,
//   ): Promise<InventoryDto> {
//     return this.inventoryService.findOne(productId, warehouseId);
//   }

//   @Patch(':productId/:warehouseId')
//   // @UseGuards(RolesGuard)
//   // @Roles(Role.ADMIN, Role.OPERATOR)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Atualizar quantidade em estoque' })
//   @ApiResponse({
//     status: 200,
//     description: 'Estoque atualizado com sucesso',
//     type: InventoryDto,
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Dados inválidos',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Não autorizado',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Acesso negado - role insuficiente',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Estoque não encontrado',
//   })
//   async update(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Param('warehouseId', ParseIntPipe) warehouseId: number,
//     @Body() updateInventoryDto: UpdateInventoryDto,
//   ): Promise<InventoryDto> {
//     return this.inventoryService.update(productId, warehouseId, updateInventoryDto);
//   }

//   @Patch(':productId/:warehouseId/adjust/:adjustment')
//   // @UseGuards(RolesGuard)
//   // @Roles(Role.ADMIN, Role.OPERATOR)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Ajustar quantidade em estoque (adicionar/subtrair)' })
//   @ApiResponse({
//     status: 200,
//     description: 'Estoque ajustado com sucesso',
//     type: InventoryDto,
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Ajuste resultaria em quantidade negativa',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Não autorizado',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Acesso negado - role insuficiente',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Estoque não encontrado',
//   })
//   async adjustQuantity(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Param('warehouseId', ParseIntPipe) warehouseId: number,
//     @Param('adjustment', ParseIntPipe) adjustment: number,
//   ): Promise<InventoryDto> {
//     return this.inventoryService.adjustQuantity(productId, warehouseId, adjustment);
//   }

//   @Delete(':productId/:warehouseId')
//   // @UseGuards(RolesGuard)
//   // @Roles(Role.ADMIN)
//   @ApiBearerAuth('JWT-auth')
//   @ApiOperation({ summary: 'Remover registro de estoque' })
//   @ApiResponse({
//     status: 200,
//     description: 'Estoque removido com sucesso',
//   })
//   @ApiResponse({
//     status: 401,
//     description: 'Não autorizado',
//   })
//   @ApiResponse({
//     status: 403,
//     description: 'Acesso negado - apenas ADMIN pode remover estoque',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Estoque não encontrado',
//   })
//   async remove(
//     @Param('productId', ParseIntPipe) productId: number,
//     @Param('warehouseId', ParseIntPipe) warehouseId: number,
//   ): Promise<void> {
//     return this.inventoryService.remove(productId, warehouseId);
//   }
// }
