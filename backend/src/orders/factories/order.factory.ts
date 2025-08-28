import { Injectable } from '@nestjs/common';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { OrderDto, OrderItemDto, ProfileSummaryDto, ProductSummaryDto } from '../dto/order.dto';
import { CreateOrderDto, CreateOrderItemDto } from '../dto/create-order.dto';

@Injectable()
export class OrderFactory {
  createOrderFromDto(dto: CreateOrderDto): Order {
    const order = new Order();
    
    order.profileId = dto.profileId;
    order.status = OrderStatus.PENDING;
    order.notes = dto.notes;
    order.quoteId = dto.quoteId;
    
    if (dto.estimatedDelivery) {
      order.estimatedDelivery = new Date(dto.estimatedDelivery);
    }
    
    // Calcular total dos itens
    order.total = dto.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
    
    return order;
  }

  createOrderItemFromDto(dto: CreateOrderItemDto, orderId: number): OrderItem {
    const orderItem = new OrderItem();
    
    orderItem.orderId = orderId;
    orderItem.productId = dto.productId;
    orderItem.quantity = dto.quantity;
    orderItem.unitPrice = dto.unitPrice;
    
    return orderItem;
  }

  toDTO(order: Order, includeRelations = false): OrderDto {
    const dto = new OrderDto();
    
    dto.id = order.id;
    dto.profileId = order.profileId;
    dto.status = order.status;
    dto.total = order.total;
    dto.notes = order.notes;
    dto.quoteId = order.quoteId;
    dto.estimatedDelivery = order.estimatedDelivery;
    dto.deliveredAt = order.deliveredAt;
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;

    if (includeRelations) {
      // Incluir dados do cliente se existir
      if (order.profile) {
        dto.profile = {
          id: order.profile.id,
          name: order.profile.name,
          phone: order.profile.phone,
        } as ProfileSummaryDto;
      }

      // Incluir itens se existirem
      if (order.orderItems && order.orderItems.length > 0) {
        dto.items = order.orderItems.map(item => this.orderItemToDTO(item));
      }
    }

    return dto;
  }

  orderItemToDTO(orderItem: OrderItem): OrderItemDto {
    const dto = new OrderItemDto();
    
    dto.id = orderItem.id;
    dto.productId = orderItem.productId;
    dto.quantity = orderItem.quantity;
    dto.unitPrice = orderItem.unitPrice;
    dto.subtotal = orderItem.quantity * orderItem.unitPrice;

    // Incluir dados do produto se existir
    if (orderItem.product) {
      dto.product = {
        id: orderItem.product.id,
        name: orderItem.product.name,
        slug: orderItem.product.slug,
      } as ProductSummaryDto;
    }

    return dto;
  }

  toDTOList(orders: Order[], includeRelations = false): OrderDto[] {
    return orders.map(order => this.toDTO(order, includeRelations));
  }

  calculateTotal(orderItems: OrderItem[]): number {
    return orderItems.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  }
}

