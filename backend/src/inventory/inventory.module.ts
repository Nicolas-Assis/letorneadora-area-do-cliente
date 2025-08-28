import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { InventoryFactory } from './factories/inventory.factory';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { Warehouse } from '../entities/warehouse.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, Product, Warehouse]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryFactory],
  exports: [InventoryService, InventoryFactory],
})
export class InventoryModule {}

