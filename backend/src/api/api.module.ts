import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ServiceModule } from '../services/service.module';

// import { AuditLogsController } from './controllers/audit-logs.controller';
// import { AuthController } from './controllers/auth.controller';
import { CategoriesController } from './controllers/categories.controller';
// import { HealthController } from './controllers/health.controller';
// import { InventoryController } from './controllers/inventory.controller';
// import { OrdersController } from './controllers/orders.controller';
// import { ProductImagesController } from './controllers/product-images.controller';
import { ProductsController } from './controllers/products.controller';
import { ProfilesController } from './controllers/profiles.controller';
// import { QuotesController } from './controllers/quotes.controller';
// import { TicketsController } from './controllers/tickets.controller';

@Module({
  controllers: [
    // AuthController,
    // AuditLogsController,
    CategoriesController,
    // HealthController,
    // InventoryController,
    // OrdersController,
    // ProductImagesController,
    ProductsController,
    ProfilesController,
    // QuotesController,
    // TicketsController,
  ],
  providers: [],
  imports: [
    ServiceModule,
    MulterModule.register({
      dest: './files',
    }),
  ],
  exports: [],
})
export class ApiModule {}
