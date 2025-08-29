import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Users } from 'src/api/entities/user.entity';
import { Product } from 'src/api/entities/product.entity';
import { ProductImage } from 'src/api/entities/product-image.entity';
import { ProductCategory } from 'src/api/entities/product-category.entity';
import { Category } from 'src/api/entities/category.entity';
import { Inventory } from 'src/api/entities/inventory.entity';
import { Order } from 'src/api/entities/order.entity';
import { OrderItem } from 'src/api/entities/order-item.entity';
import { QuoteItem } from 'src/api/entities/quote-item.entity';
import { Ticket } from 'src/api/entities/ticket.entity';
import { TicketMessage } from 'src/api/entities/ticket-message.entity'; // <--- adicionar
import { AuditLog } from 'src/api/entities/audit-log.entity';

// Services
import { UsersService } from './user.service';
import { ProductsService } from './products.service';
import { CategoriesService } from './categories.service';
import { TicketsService } from './tickets.service';

// Factories
import { UserFactory } from 'src/factories/user.factory';
import { ProductFactory } from 'src/factories/product.factory';
import { CategoryFactory } from 'src/factories/category.factory';
import { TicketFactory } from 'src/factories/ticket.factory';

@Module({
  controllers: [],
  providers: [
    UsersService,
    ProductsService,
    CategoriesService,
    TicketsService,
    // factories
    UserFactory,
    ProductFactory,
    CategoryFactory,
    TicketFactory,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Product,
      ProductImage,
      ProductCategory,
      Category,
      Inventory,
      Order,
      OrderItem,
      QuoteItem,
      Ticket,
      TicketMessage,
      AuditLog,
    ]),
  ],
  exports: [
    UsersService,
    ProductsService,
    CategoriesService,
    TicketsService,
    // export factories if other modules need them
    UserFactory,
    ProductFactory,
    CategoryFactory,
    TicketFactory,
    TypeOrmModule, // <-- exporta TypeOrmModule (opcional)
  ],
})
export class ServiceModule {}
