import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../api/entities/order.entity';
import { OrderItem } from '../api/entities/order-item.entity';
import { Product } from '../api/entities/product.entity';
import { CreateOrderDto } from '../api/dto/order/create-order.dto';
import { UpdateOrderDto } from '../api/dto/order/update-order.dto';
import { FilterOrdersDto } from '../api/dto/order/filter-orders.dto';
import { OrderDto } from '../api/dto/order/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateOrderDto & { userId?: string; userEmail?: string }): Promise<OrderDto> {
    // Verificar se todos os produtos existem
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.productRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new BadRequestException('Um ou mais produtos não foram encontrados');
    }

    // Calcular total do pedido
    let total = 0;
    for (const item of dto.items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    // Criar pedido
    const order = this.orderRepository.create({
      userId: dto.userId,
      userEmail: dto.userEmail,
      status: OrderStatus.PENDING,
      total,
      notes: dto.notes,
      estimatedDelivery: dto.estimatedDelivery ? new Date(dto.estimatedDelivery) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOrder = await this.orderRepository.save(order);

    // Criar itens do pedido
    const orderItems = dto.items.map((itemDto) => 
      this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: itemDto.productId,
        quantity: itemDto.quantity,
        unitPrice: products.find(p => p.id === itemDto.productId)?.price || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    await this.orderItemRepository.save(orderItems);

    return this.findOneById(savedOrder.id);
  }

  async findAll(filter: FilterOrdersDto): Promise<any> {
    const {
      page = 1,
      pageSize = 10,
      status,
      userId,
      startDate,
      endDate,
      minTotal,
      maxTotal,
    } = filter;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    // Aplicar filtros
    if (userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('order.createdAt >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      queryBuilder.andWhere('order.createdAt <= :endDate', { endDate: new Date(endDate) });
    }

    if (minTotal !== undefined) {
      queryBuilder.andWhere('order.total >= :minTotal', { minTotal });
    }

    if (maxTotal !== undefined) {
      queryBuilder.andWhere('order.total <= :maxTotal', { maxTotal });
    }

    // Incluir itens do pedido
    queryBuilder
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product');

    // Ordenação
    queryBuilder.orderBy('order.createdAt', 'DESC');

    // Paginação
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      data: orders.map(order => this.toDTO(order)),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOneById(id: number): Promise<OrderDto> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return this.toDTO(order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Verificar se pode ser atualizado
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Pedidos entregues ou cancelados não podem ser alterados');
    }

    // Atualizar campos
    if (dto.status !== undefined) {
      this.validateStatusTransition(order.status, dto.status);
      order.status = dto.status;

      if (dto.status === OrderStatus.DELIVERED && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }
    }

    if (dto.notes !== undefined) {
      order.notes = dto.notes;
    }

    if (dto.estimatedDelivery !== undefined) {
      order.estimatedDelivery = dto.estimatedDelivery ? new Date(dto.estimatedDelivery) : null;
    }

    order.updatedAt = new Date();

    await this.orderRepository.save(order);

    return this.findOneById(id);
  }

  async updateStatus(id: number, status: string): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Validar se o status é válido
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new BadRequestException('Status inválido');
    }

    this.validateStatusTransition(order.status, status as OrderStatus);
    
    order.status = status as OrderStatus;
    order.updatedAt = new Date();

    if (status === OrderStatus.DELIVERED && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await this.orderRepository.save(order);

    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Pedidos entregues não podem ser removidos');
    }

    await this.orderRepository.remove(order);
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.IN_PRODUCTION, OrderStatus.CANCELLED],
      [OrderStatus.IN_PRODUCTION]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Transição de status inválida: ${currentStatus} -> ${newStatus}`,
      );
    }
  }

  private toDTO(order: any): OrderDto {
    return {
      id: order.id,
      userId: order.userId,
      userEmail: order.userEmail,
      status: order.status,
      total: order.total,
      notes: order.notes,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.orderItems?.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
        } : undefined,
      })) || [],
    };
  }
}

