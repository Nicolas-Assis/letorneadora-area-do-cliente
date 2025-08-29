import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrderFactory } from './factories/order.factory';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { Profile } from '../entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, Profile]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderFactory],
  exports: [OrdersService, OrderFactory],
})
export class OrdersModule {}

