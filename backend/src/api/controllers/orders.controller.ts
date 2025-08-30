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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from '../../services/orders.service';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { UpdateOrderDto } from '../dto/order/update-order.dto';
import { FilterOrdersDto } from '../dto/order/filter-orders.dto';
import { OrderDto } from '../dto/order/order.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo pedido (Autenticado)' })
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
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req): Promise<OrderDto> {
    // Adicionar informações do usuário autenticado ao pedido
    const orderData = {
      ...createOrderDto,
      userId: req.user.uid,
      userEmail: req.user.email,
    };
    return this.ordersService.create(orderData);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os pedidos (Admin/Operator)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos recuperada com sucesso',
  })
  async findAll(@Query() filter: FilterOrdersDto) {
    return this.ordersService.findAll(filter);
  }

  @Get('my-orders')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar meus pedidos (Cliente)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos do cliente recuperada com sucesso',
  })
  async findMyOrders(@Query() filter: FilterOrdersDto, @Request() req) {
    // Filtrar apenas pedidos do usuário autenticado
    const userFilter = {
      ...filter,
      userId: req.user.uid,
    };
    return this.ordersService.findAll(userFilter);
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado',
    type: OrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - pedido não pertence ao usuário',
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<OrderDto> {
    const order = await this.ordersService.findOneById(id);
    
    // Verificar se o usuário tem permissão para ver este pedido
    if (req.user.role === Role.CLIENT && order.userId !== req.user.uid) {
      throw new Error('Acesso negado - pedido não pertence ao usuário');
    }
    
    return order;
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar pedido (Admin/Operator)' })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
    type: OrderDto,
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
    description: 'Pedido não encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDto> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status do pedido (Admin/Operator)' })
  @ApiResponse({
    status: 200,
    description: 'Status do pedido atualizado com sucesso',
  })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover pedido (Admin apenas)' })
  @ApiResponse({
    status: 200,
    description: 'Pedido removido com sucesso',
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

