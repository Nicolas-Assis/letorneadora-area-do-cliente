import { Injectable } from '@nestjs/common';
import { Inventory } from '../api/entities/inventory.entity';
import { InventoryDto, ProductSummaryDto, WarehouseDto } from '../api/dto/inventory/inventory.dto';
import { CreateInventoryDto } from '../api/dto/inventory/create-inventory.dto';

@Injectable()
export class InventoryFactory {
  createInventoryFromDto(dto: CreateInventoryDto): Inventory {
    const inventory = new Inventory();

//    inventory.productId = dto.productId;
//    inventory.warehouseId = dto.warehouseId;
    inventory.quantity = dto.quantity;

    return inventory;
  }

  toDTO(inventory: Inventory, includeRelations = false): InventoryDto {
    const dto = new InventoryDto();

//    dto.productId = inventory.productId;
//    dto.warehouseId = inventory.warehouseId;
    dto.quantity = inventory.quantity;

    if (includeRelations) {
      // Incluir dados do produto se existir
      if (inventory.product) {
        dto.product = {
          id: inventory.product.id,
          name: inventory.product.name,
          slug: inventory.product.slug,
        } as ProductSummaryDto;
      }

      // Incluir dados do armazém se existir
      if (inventory.warehouse) {
        dto.warehouse = {
          id: inventory.warehouse.id,
          name: inventory.warehouse.name,
          code: inventory.warehouse.code,
        } as WarehouseDto;
      }
    }

    return dto;
  }

  toDTOList(inventories: Inventory[], includeRelations = false): InventoryDto[] {
    return inventories.map((inventory) => this.toDTO(inventory, includeRelations));
  }
}
