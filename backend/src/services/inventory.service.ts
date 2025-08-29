// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, MoreThanOrEqual, LessThanOrEqual, LessThan } from 'typeorm';
// import { Inventory } from '../../entities/inventory.entity';
// import { Product } from '../../entities/product.entity';
// import { Warehouse } from '../../entities/warehouse.entity';
// import { CreateInventoryDto } from '../api/dto/inventory/create-inventory.dto';
// import { UpdateInventoryDto } from '../api/dto/inventory/update-inventory.dto';
// import { FilterInventoryDto } from '../api/dto/inventory/filter-inventory.dto';
// import { InventoryDto } from '../api/dto/inventory/inventory.dto';
// import { InventoryFactory } from '../factories/inventory.factory';
// import { PaginatedResponseDto } from '../../common/dto/base-response.dto';

// @Injectable()
// export class InventoryService {
//   constructor(
//     @InjectRepository(Inventory)
//     private readonly inventoryRepository: Repository<Inventory>,
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,
//     @InjectRepository(Warehouse)
//     private readonly warehouseRepository: Repository<Warehouse>,
//     private readonly inventoryFactory: InventoryFactory,
//   ) {}

//   async create(dto: CreateInventoryDto): Promise<InventoryDto> {
//     // Verificar se produto existe
//     const product = await this.productRepository.findOne({
//       where: { id: dto.productId },
//     });

//     if (!product) {
//       throw new NotFoundException('Produto não encontrado');
//     }

//     // Verificar se armazém existe
//     const warehouse = await this.warehouseRepository.findOne({
//       where: { id: dto.warehouseId },
//     });

//     if (!warehouse) {
//       throw new NotFoundException('Armazém não encontrado');
//     }

//     // Verificar se já existe estoque para este produto/armazém
//     const existingInventory = await this.inventoryRepository.findOne({
//       where: {
//         productId: dto.productId,
//         warehouseId: dto.warehouseId,
//       },
//     });

//     if (existingInventory) {
//       throw new BadRequestException('Já existe estoque para este produto neste armazém');
//     }

//     const inventory = this.inventoryFactory.createInventoryFromDto(dto);
//     const savedInventory = await this.inventoryRepository.save(inventory);

//     return this.findOne(savedInventory.productId, savedInventory.warehouseId);
//   }

//   async findAll(filter: FilterInventoryDto): Promise<PaginatedResponseDto<InventoryDto>> {
//     const {
//       page = 1,
//       limit = 10,
//       productId,
//       warehouseId,
//       minQuantity,
//       maxQuantity,
//       lowStock,
//       includeProduct,
//       includeWarehouse,
//     } = filter;

//     const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory');

//     // Aplicar filtros
//     if (productId !== undefined) {
//       queryBuilder.andWhere('inventory.productId = :productId', { productId });
//     }

//     if (warehouseId !== undefined) {
//       queryBuilder.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
//     }

//     if (minQuantity !== undefined) {
//       queryBuilder.andWhere('inventory.quantity >= :minQuantity', { minQuantity });
//     }

//     if (maxQuantity !== undefined) {
//       queryBuilder.andWhere('inventory.quantity <= :maxQuantity', { maxQuantity });
//     }

//     if (lowStock) {
//       queryBuilder
//         .innerJoin('inventory.product', 'product')
//         .andWhere('inventory.quantity < product.minStock')
//         .andWhere('product.minStock IS NOT NULL');
//     }

//     // Incluir relações se solicitado
//     if (includeProduct) {
//       queryBuilder.leftJoinAndSelect('inventory.product', 'product');
//     }

//     if (includeWarehouse) {
//       queryBuilder.leftJoinAndSelect('inventory.warehouse', 'warehouse');
//     }

//     // Ordenação
//     const sortField = filter.sort || 'quantity';
//     const sortOrder = filter.order || 'DESC';
//     queryBuilder.orderBy(`inventory.${sortField}`, sortOrder);

//     // Paginação
//     const skip = (page - 1) * limit;
//     queryBuilder.skip(skip).take(limit);

//     const [inventories, total] = await queryBuilder.getManyAndCount();

//     const inventoryDtos = this.inventoryFactory.toDTOList(
//       inventories,
//       includeProduct || includeWarehouse,
//     );

//     return new PaginatedResponseDto(
//       true,
//       'Estoque recuperado com sucesso',
//       inventoryDtos,
//       page,
//       limit,
//       total,
//     );
//   }

//   async findOne(productId: number, warehouseId: number): Promise<InventoryDto> {
//     const inventory = await this.inventoryRepository.findOne({
//       where: { productId, warehouseId },
//       relations: ['product', 'warehouse'],
//     });

//     if (!inventory) {
//       throw new NotFoundException('Estoque não encontrado');
//     }

//     return this.inventoryFactory.toDTO(inventory, true);
//   }

//   async update(
//     productId: number,
//     warehouseId: number,
//     dto: UpdateInventoryDto,
//   ): Promise<InventoryDto> {
//     const inventory = await this.inventoryRepository.findOne({
//       where: { productId, warehouseId },
//     });

//     if (!inventory) {
//       throw new NotFoundException('Estoque não encontrado');
//     }

//     inventory.quantity = dto.quantity;
//     await this.inventoryRepository.save(inventory);

//     return this.findOne(productId, warehouseId);
//   }

//   async adjustQuantity(
//     productId: number,
//     warehouseId: number,
//     adjustment: number,
//   ): Promise<InventoryDto> {
//     const inventory = await this.inventoryRepository.findOne({
//       where: { productId, warehouseId },
//     });

//     if (!inventory) {
//       throw new NotFoundException('Estoque não encontrado');
//     }

//     const newQuantity = inventory.quantity + adjustment;

//     if (newQuantity < 0) {
//       throw new BadRequestException('Quantidade resultante não pode ser negativa');
//     }

//     inventory.quantity = newQuantity;
//     await this.inventoryRepository.save(inventory);

//     return this.findOne(productId, warehouseId);
//   }

//   async remove(productId: number, warehouseId: number): Promise<void> {
//     const inventory = await this.inventoryRepository.findOne({
//       where: { productId, warehouseId },
//     });

//     if (!inventory) {
//       throw new NotFoundException('Estoque não encontrado');
//     }

//     await this.inventoryRepository.remove(inventory);
//   }

//   async getTotalQuantityByProduct(productId: number): Promise<number> {
//     const result = await this.inventoryRepository
//       .createQueryBuilder('inventory')
//       .select('SUM(inventory.quantity)', 'total')
//       .where('inventory.productId = :productId', { productId })
//       .getRawOne();

//     return parseFloat(result.total) || 0;
//   }

//   async getLowStockProducts(): Promise<InventoryDto[]> {
//     const inventories = await this.inventoryRepository
//       .createQueryBuilder('inventory')
//       .innerJoinAndSelect('inventory.product', 'product')
//       .leftJoinAndSelect('inventory.warehouse', 'warehouse')
//       .where('inventory.quantity < product.minStock')
//       .andWhere('product.minStock IS NOT NULL')
//       .orderBy('inventory.quantity', 'ASC')
//       .getMany();

//     return this.inventoryFactory.toDTOList(inventories, true);
//   }
// }
