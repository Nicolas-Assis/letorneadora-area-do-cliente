import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrdersDto, OrderStatus } from './dto/query-orders.dto';
import { BaseResponseDto, PaginatedResponseDto } from '../common/dto/base-response.dto';
import { Order } from '../common/entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Listar pedidos',
    description: 'Retorna uma lista paginada de pedidos com filtros opcionais'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pedidos retornada com sucesso',
    type: PaginatedResponseDto<Order>
  })
  async findAll(@Query() queryDto: QueryOrdersDto): Promise<PaginatedResponseDto<Order>> {
    return await this.ordersService.findAll(queryDto);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Obter estatísticas de pedidos',
    description: 'Retorna estatísticas sobre pedidos, status e receita'
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
            totalOrders: { type: 'number', example: 45 },
            statusStats: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: Object.values(OrderStatus) },
                  count: { type: 'number' }
                }
              }
            },
            totalRevenue: { type: 'number', example: 15750.00 },
            avgOrderValue: { type: 'number', example: 875.50 },
            avgDeliveryTime: { type: 'number', example: 12.5 },
            urgentOrders: { type: 'number', example: 3 },
            recentOrders: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  orderNumber: { type: 'string' },
                  customerName: { type: 'string' },
                  status: { type: 'string' },
                  totalAmount: { type: 'number' },
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
    const stats = await this.ordersService.getOrderStats();
    return BaseResponseDto.success('Estatísticas obtidas com sucesso', stats);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obter pedido por ID',
    description: 'Retorna os detalhes de um pedido específico'
  })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 'order_123' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pedido encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Pedido encontrado com sucesso' },
        data: { $ref: '#/components/schemas/Order' },
        timestamp: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pedido não encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Pedido com ID order_123 não encontrado' },
        timestamp: { type: 'string' }
      }
    }
  })
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<Order>> {
    const order = await this.ordersService.findOne(id);
    return BaseResponseDto.success('Pedido encontrado com sucesso', order);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Criar novo pedido/orçamento',
    description: 'Cria um novo pedido de orçamento no sistema'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Pedido criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Pedido criado com sucesso' },
        data: { $ref: '#/components/schemas/Order' },
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
  async create(@Body() createOrderDto: CreateOrderDto): Promise<BaseResponseDto<Order>> {
    const order = await this.ordersService.create(createOrderDto);
    return BaseResponseDto.success('Pedido criado com sucesso', order);
  }

  @Patch(':id/status')
  @ApiOperation({ 
    summary: 'Atualizar status do pedido',
    description: 'Atualiza o status de um pedido existente'
  })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 'order_123' })
  @ApiBody({
    description: 'Novo status do pedido',
    schema: {
      type: 'object',
      properties: {
        status: { 
          type: 'string', 
          enum: Object.values(OrderStatus),
          example: OrderStatus.APPROVED 
        }
      },
      required: ['status']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Status do pedido atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Status do pedido atualizado com sucesso' },
        data: { $ref: '#/components/schemas/Order' },
        timestamp: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pedido não encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Pedido com ID order_123 não encontrado' },
        timestamp: { type: 'string' }
      }
    }
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ): Promise<BaseResponseDto<Order>> {
    const order = await this.ordersService.updateStatus(id, body.status);
    return BaseResponseDto.success('Status do pedido atualizado com sucesso', order);
  }
}

