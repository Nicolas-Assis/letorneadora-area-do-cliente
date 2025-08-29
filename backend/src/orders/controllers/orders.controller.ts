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
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FilterOrdersDto } from '../dto/filter-orders.dto';
import { OrderDto } from '../dto/order.dto';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/enums/role.enum';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
    type: OrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou produtos não encontrados',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil do cliente não encontrado',
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar pedidos com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos recuperada com sucesso',
    type: PaginatedResponseDto<OrderDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async findAll(@Query() filter: FilterOrdersDto): Promise<PaginatedResponseDto<OrderDto>> {
    return this.ordersService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado',
    type: OrderDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderDto> {
    return this.ordersService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
    type: OrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou pedido não pode ser alterado',
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
    description: 'Pedido não encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDto> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Confirmar pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido confirmado com sucesso',
    type: OrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Pedido não pode ser confirmado',
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
    description: 'Pedido não encontrado',
  })
  async confirm(@Param('id', ParseIntPipe) id: number): Promise<OrderDto> {
    return this.ordersService.confirm(id);
  }

  @Patch(':id/start-production')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Iniciar produção do pedido' })
  @ApiResponse({
    status: 200,
    description: 'Produção iniciada com sucesso',
    type: OrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Pedido não pode iniciar produção',
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
    description: 'Pedido não encontrado',
  })
  async startProduction(@Param('id', ParseIntPipe) id: number): Promise<OrderDto> {
    return this.ordersService.startProduction(id);
  }

  @Patch(':id/mark-ready')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Marcar pedido como pronto' })
  @ApiResponse({
    status: 200,
    description: 'Pedido marcado como pronto',
    type: OrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Pedido não pode ser marcado como pronto',
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
    description: 'Pedido não encontrado',
  })
  async markReady(@Param('id', ParseIntPipe) id: number): Promise<OrderDto> {
    return this.ordersService.markReady(id);
  }

  @Patch(':id/ship')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enviar pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido enviado com sucesso',
    type: OrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Pedido não pode ser enviado',
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
    description: 'Pedido não encontrado',
  })
  async ship(@Param('id', ParseIntPipe) id: number): Promise<OrderDto> {
    return this.ordersService.ship(id);
  }

  @Patch(':id/deliver')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Marcar pedido como entregue' })
  @ApiResponse({
    status: 200,
    description: 'Pedido marcado como entregue',
    type: OrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Pedido não pode ser marcado como entregue',
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
    description: 'Pedido não encontrado',
  })
  async deliver(@Param('id', ParseIntPipe) id: number): Promise<OrderDto> {
    return this.ordersService.deliver(id);
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cancelar pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido cancelado com sucesso',
    type: OrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Pedido não pode ser cancelado',
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
    description: 'Pedido não encontrado',
  })
  async cancel(@Param('id', ParseIntPipe) id: number): Promise<OrderDto> {
    return this.ordersService.cancel(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido removido com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Pedido entregue não pode ser removido',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas ADMIN pode remover pedidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}

