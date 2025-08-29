import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual, LessThan } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { Profile } from '../../entities/profile.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FilterOrdersDto } from '../dto/filter-orders.dto';
import { OrderDto } from '../dto/order.dto';
import { OrderFactory } from '../factories/order.factory';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly orderFactory: OrderFactory,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderDto> {
    // Verificar se perfil existe
    const profile = await this.profileRepository.findOne({
      where: { id: dto.profileId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil do cliente não encontrado');
    }

    // Verificar se todos os produtos existem
    const productIds = dto.items.map(item => item.productId);
    const products = await this.productRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new BadRequestException('Um ou mais produtos não foram encontrados');
    }

    // Criar pedido
    const order = this.orderFactory.createOrderFromDto(dto);
    const savedOrder = await this.orderRepository.save(order);

    // Criar itens do pedido
    const orderItems = dto.items.map(itemDto => 
      this.orderFactory.createOrderItemFromDto(itemDto, savedOrder.id)
    );

    await this.orderItemRepository.save(orderItems);

    return this.findOneById(savedOrder.id);
  }

  async findAll(filter: FilterOrdersDto): Promise<PaginatedResponseDto<OrderDto>> {
    const { 
      page = 1, 
      limit = 10, 
      profileId, 
      status, 
      quoteId,
      startDate, 
      endDate, 
      minTotal, 
      maxTotal, 
      overdue,
      includeProfile, 
      includeItems 
    } = filter;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    // Aplicar filtros
    if (profileId) {
      queryBuilder.andWhere('order.profileId = :profileId', { profileId });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (quoteId !== undefined) {
      queryBuilder.andWhere('order.quoteId = :quoteId', { quoteId });
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

    if (overdue) {
      queryBuilder
        .andWhere('order.estimatedDelivery < :now', { now: new Date() })
        .andWhere('order.status NOT IN (:...completedStatuses)', { 
          completedStatuses: [OrderStatus.DELIVERED, OrderStatus.CANCELLED] 
        });
    }

    // Incluir relações se solicitado
    if (includeProfile) {
      queryBuilder.leftJoinAndSelect('order.profile', 'profile');
    }

    if (includeItems) {
      queryBuilder
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .leftJoinAndSelect('orderItems.product', 'product');
    }

    // Ordenação
    const sortField = filter.sort || 'createdAt';
    const sortOrder = filter.order || 'DESC';
    queryBuilder.orderBy(`order.${sortField}`, sortOrder);

    // Paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [orders, total] = await queryBuilder.getManyAndCount();

    const orderDtos = this.orderFactory.toDTOList(orders, includeProfile || includeItems);

    return new PaginatedResponseDto(
      true,
      'Pedidos recuperados com sucesso',
      orderDtos,
      page,
      limit,
      total,
    );
  }

  async findOneById(id: number, includeRelations = true): Promise<OrderDto> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .where('order.id = :id', { id });

    if (includeRelations) {
      queryBuilder
        .leftJoinAndSelect('order.profile', 'profile')
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .leftJoinAndSelect('orderItems.product', 'product');
    }

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return this.orderFactory.toDTO(order, includeRelations);
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
      // Validar transições de status
      this.validateStatusTransition(order.status, dto.status);
      order.status = dto.status;

      // Se status for DELIVERED, definir data de entrega
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

    if (dto.deliveredAt !== undefined) {
      order.deliveredAt = dto.deliveredAt ? new Date(dto.deliveredAt) : null;
    }

    await this.orderRepository.save(order);

    return this.findOneById(id);
  }

  async confirm(id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Apenas pedidos pendentes podem ser confirmados');
    }

    order.status = OrderStatus.CONFIRMED;
    await this.orderRepository.save(order);

    return this.findOneById(id);
  }

  async startProduction(id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Apenas pedidos confirmados podem iniciar produção');
    }

    order.status = OrderStatus.IN_PRODUCTION;
    await this.orderRepository.save(order);

    return this.findOneById(id);
  }

  async markReady(id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status !== OrderStatus.IN_PRODUCTION) {
      throw new BadRequestException('Apenas pedidos em produção podem ser marcados como prontos');
    }

    order.status = OrderStatus.READY;
    await this.orderRepository.save(order);

    return this.findOneById(id);
  }

  async ship(id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException('Apenas pedidos prontos podem ser enviados');
    }

    order.status = OrderStatus.SHIPPED;
    await this.orderRepository.save(order);

    return this.findOneById(id);
  }

  async deliver(id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status !== OrderStatus.SHIPPED) {
      throw new BadRequestException('Apenas pedidos enviados podem ser marcados como entregues');
    }

    order.status = OrderStatus.DELIVERED;
    order.deliveredAt = new Date();
    await this.orderRepository.save(order);

    return this.findOneById(id);
  }

  async cancel(id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Pedidos entregues não podem ser cancelados');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Pedido já está cancelado');
    }

    order.status = OrderStatus.CANCELLED;
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
        `Transição de status inválida: ${currentStatus} -> ${newStatus}`
      );
    }
  }
}

