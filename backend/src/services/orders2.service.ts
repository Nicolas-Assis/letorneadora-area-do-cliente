// import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateOrderDto } from '../api/dto/order/create-order.dto';
// import { QueryOrdersDto, OrderStatus } from '../api/dto/order/query-orders.dto';
// import { Order, OrderItem } from '../api/entities/order.entity';
// import { ProductsService } from './products2.service';
// // import { QueryProductsDto } from '../products/dto/query-products.dto';
// // import { PaginatedResponseDto } from '../common/dto/base-response.dto';

// export class CreateOrderItemDto {
//   productId: string;
//   quantity: number;
//   specifications?: string;
// }

// @Injectable()
// export class OrdersService {
//   constructor(private readonly productsService: ProductsService) {}

//   // Simulação de pedidos em memória
//   private orders: Order[] = [
//     new Order({
//       id: 'order_1',
//       orderNumber: 'PED-2024-001',
//       status: OrderStatus.QUOTED,
//       customerName: 'João Silva',
//       customerEmail: 'joao@example.com',
//       customerPhone: '(11) 99999-9999',
//       customerCompany: 'Empresa LTDA',
//       customerCnpj: '12.345.678/0001-90',
//       items: [], // Será preenchido no método de inicialização
//       description:
//         'Preciso de peças usinadas para projeto automotivo. Tolerância crítica de ±0.05mm.',
//       desiredDeadline: 15,
//       estimatedDeadline: 20,
//       totalAmount: 1500.0,
//       notes: 'Projeto urgente, favor priorizar.',
//       internalNotes: 'Cliente preferencial, dar desconto de 5%.',
//       createdAt: new Date('2024-01-15T10:30:00.000Z'),
//       updatedAt: new Date('2024-01-20T15:45:00.000Z'),
//       approvedAt: new Date('2024-01-18T14:20:00.000Z'),
//     }),
//     new Order({
//       id: 'order_2',
//       orderNumber: 'PED-2024-002',
//       status: OrderStatus.IN_PRODUCTION,
//       customerName: 'Maria Santos',
//       customerEmail: 'maria@empresa.com',
//       customerPhone: '(11) 98888-8888',
//       customerCompany: 'Indústria ABC',
//       items: [], // Será preenchido no método de inicialização
//       description:
//         'Eixos torneados para linha de produção. Especificação conforme desenho técnico anexo.',
//       desiredDeadline: 10,
//       estimatedDeadline: 12,
//       totalAmount: 890.0,
//       notes: 'Entregar em lotes de 10 peças.',
//       createdAt: new Date('2024-01-18T14:20:00.000Z'),
//       updatedAt: new Date('2024-01-25T09:30:00.000Z'),
//       approvedAt: new Date('2024-01-20T16:45:00.000Z'),
//     }),
//     new Order({
//       id: 'order_3',
//       orderNumber: 'PED-2024-003',
//       status: OrderStatus.PENDING,
//       customerName: 'Carlos Oliveira',
//       customerEmail: 'carlos@metalurgica.com',
//       customerPhone: '(11) 97777-7777',
//       customerCompany: 'Metalúrgica XYZ',
//       customerCnpj: '98.765.432/0001-10',
//       items: [], // Será preenchido no método de inicialização
//       description:
//         'Flanges em aço inox para sistema de tubulação industrial. Pressão de trabalho 16 bar.',
//       desiredDeadline: 25,
//       notes: 'Certificado de qualidade obrigatório.',
//       createdAt: new Date('2024-01-22T11:15:00.000Z'),
//       updatedAt: new Date('2024-01-22T11:15:00.000Z'),
//     }),
//     new Order({
//       id: 'order_4',
//       orderNumber: 'PED-2024-004',
//       status: OrderStatus.DELIVERED,
//       customerName: 'Ana Costa',
//       customerEmail: 'ana@consultoria.com',
//       customerPhone: '(11) 96666-6666',
//       items: [], // Será preenchido no método de inicialização
//       description: 'Protótipo de engrenagem para teste de conceito. Material bronze fosforoso.',
//       desiredDeadline: 7,
//       estimatedDeadline: 8,
//       totalAmount: 450.0,
//       createdAt: new Date('2024-01-10T09:00:00.000Z'),
//       updatedAt: new Date('2024-01-25T17:30:00.000Z'),
//       approvedAt: new Date('2024-01-12T10:20:00.000Z'),
//       deliveredAt: new Date('2024-01-20T14:00:00.000Z'),
//     }),
//     new Order({
//       id: 'order_5',
//       orderNumber: 'PED-2024-005',
//       status: OrderStatus.ANALYZING,
//       customerName: 'Roberto Lima',
//       customerEmail: 'roberto@startup.com',
//       customerPhone: '(11) 95555-5555',
//       items: [], // Será preenchido no método de inicialização
//       description:
//         'Componentes para drone de inspeção. Peso crítico, material alumínio aeronáutico.',
//       desiredDeadline: 20,
//       notes: 'Projeto inovador, possível parceria futura.',
//       createdAt: new Date('2024-01-25T16:45:00.000Z'),
//       updatedAt: new Date('2024-01-26T08:20:00.000Z'),
//     }),
//   ];

//   private orderCounter = 5;

//   async onModuleInit() {
//     // Inicializar itens dos pedidos com produtos reais
//     await this.initializeOrderItems();
//   }

//   private async initializeOrderItems() {
//     try {
//       // Obter alguns produtos para usar nos pedidos
//       const products = await this.productsService.findAll(new QueryProductsDto());
//       const productList = products.data || [];

//       if (productList.length > 0) {
//         // Order 1 - 2 itens
//         this.orders[0].items = [
//           new OrderItem({
//             id: 'item_1',
//             product: productList[0],
//             quantity: 5,
//             unitPrice: 150.5,
//             totalPrice: 752.5,
//             specifications: 'Acabamento anodizado azul',
//           }),
//           new OrderItem({
//             id: 'item_2',
//             product: productList[1],
//             quantity: 3,
//             unitPrice: 89.9,
//             totalPrice: 269.7,
//           }),
//         ];

//         // Order 2 - 1 item
//         this.orders[1].items = [
//           new OrderItem({
//             id: 'item_3',
//             product: productList[1],
//             quantity: 10,
//             unitPrice: 89.0,
//             totalPrice: 890.0,
//             specifications: 'Tratamento térmico especial',
//           }),
//         ];

//         // Order 3 - 1 item
//         this.orders[2].items = [
//           new OrderItem({
//             id: 'item_4',
//             product: productList[2],
//             quantity: 4,
//             unitPrice: 320.0,
//             totalPrice: 1280.0,
//           }),
//         ];

//         // Order 4 - 1 item
//         this.orders[3].items = [
//           new OrderItem({
//             id: 'item_5',
//             product: productList[4],
//             quantity: 1,
//             unitPrice: 450.0,
//             totalPrice: 450.0,
//             specifications: 'Protótipo para testes',
//           }),
//         ];

//         // Order 5 - 2 itens
//         this.orders[4].items = [
//           new OrderItem({
//             id: 'item_6',
//             product: productList[0],
//             quantity: 8,
//             unitPrice: 140.0,
//             totalPrice: 1120.0,
//             specifications: 'Peso reduzido, furos adicionais',
//           }),
//           new OrderItem({
//             id: 'item_7',
//             product: productList[5],
//             quantity: 12,
//             unitPrice: 25.5,
//             totalPrice: 306.0,
//           }),
//         ];
//       }
//     } catch (error) {
//       console.log('Erro ao inicializar itens dos pedidos:', error.message);
//     }
//   }

//   async findAll(queryDto: QueryOrdersDto): Promise<PaginatedResponseDto<Order>> {
//     let filteredOrders = [...this.orders];

//     // Aplicar filtros
//     if (queryDto.status) {
//       filteredOrders = filteredOrders.filter((o) => o.status === queryDto.status);
//     }

//     if (queryDto.customerEmail) {
//       filteredOrders = filteredOrders.filter((o) =>
//         o.customerEmail.toLowerCase().includes(queryDto.customerEmail!.toLowerCase()),
//       );
//     }

//     if (queryDto.customerCompany) {
//       filteredOrders = filteredOrders.filter((o) =>
//         o.customerCompany?.toLowerCase().includes(queryDto.customerCompany!.toLowerCase()),
//       );
//     }

//     if (queryDto.startDate) {
//       const startDate = new Date(queryDto.startDate);
//       filteredOrders = filteredOrders.filter((o) => o.createdAt >= startDate);
//     }

//     if (queryDto.endDate) {
//       const endDate = new Date(queryDto.endDate);
//       filteredOrders = filteredOrders.filter((o) => o.createdAt <= endDate);
//     }

//     if (queryDto.urgent) {
//       filteredOrders = filteredOrders.filter((o) => o.desiredDeadline && o.desiredDeadline <= 7);
//     }

//     // if (queryDto.search) {
//     //   const searchTerm = queryDto.search.toLowerCase();
//     //   filteredOrders = filteredOrders.filter(
//     //     (o) =>
//     //       o.orderNumber.toLowerCase().includes(searchTerm) ||
//     //       o.customerName.toLowerCase().includes(searchTerm) ||
//     //       o.customerEmail.toLowerCase().includes(searchTerm) ||
//     //       o.description.toLowerCase().includes(searchTerm) ||
//     //       (o.customerCompany && o.customerCompany.toLowerCase().includes(searchTerm)),
//     //   );
//     // }

//     // Aplicar ordenação
//     // if (queryDto.sort) {
//     //   filteredOrders.sort((a, b) => {
//     //     const aValue = this.getNestedValue(a, queryDto.sort!);
//     //     const bValue = this.getNestedValue(b, queryDto.sort!);

//     //     // Use sortOrder if exists, otherwise default to 'asc'
//     //     const sortOrder = (queryDto as any).sortOrder || 'asc';
//     //     if (sortOrder === 'desc') {
//     //       return bValue > aValue ? 1 : -1;
//     //     }
//     //     return aValue > bValue ? 1 : -1;
//     //   });
//     // } else {
//     //   // Ordenação padrão: mais recentes primeiro
//     //   filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
//     // }

//     // Aplicar paginação
//     // const total = filteredOrders.length;
//     // const page = queryDto.page || 1;
//     // const limit = queryDto.limit || 10;
//     // const skip = (page - 1) * limit;

//     // const paginatedOrders = filteredOrders.slice(skip, skip + limit);

//     // return PaginatedResponseDto.create(
//     //   'Pedidos encontrados com sucesso',
//     //   paginatedOrders,
//     //   // page,
//     //   // limit,
//     //   total,
//     // );
//   }

//   async findOne(id: string): Promise<Order> {
//     const order = this.orders.find((o) => o.id === id);
//     if (!order) {
//       throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
//     }
//     return order;
//   }

//   async create(createOrderDto: CreateOrderDto): Promise<Order> {
//     // Validar produtos dos itens
//     const orderItems: OrderItem[] = [];

//     for (const itemDto of createOrderDto.items) {
//       const product = await this.productsService.findOne(String(itemDto.productId));

//       const orderItem = new OrderItem({
//         id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//         product,
//         quantity: itemDto.quantity,
//         specifications: itemDto.specifications,
//       });

//       orderItems.push(orderItem);
//     }

//     // Criar novo pedido
//     this.orderCounter++;
//     const orderNumber = `PED-2024-${this.orderCounter.toString().padStart(3, '0')}`;

//     const newOrder = new Order({
//       id: `order_${Date.now()}`,
//       orderNumber,
//       status: OrderStatus.PENDING,
//       // customerName: createOrderDto.customerName,
//       // customerEmail: createOrderDto.customerEmail,
//       // customerPhone: createOrderDto.customerPhone,
//       // customerCompany: createOrderDto.customerCompany,
//       // customerCnpj: createOrderDto.customerCnpj,
//       items: orderItems,
//       // description: createOrderDto.description,
//       // desiredDeadline: createOrderDto.desiredDeadline,
//       notes: createOrderDto.notes,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     this.orders.push(newOrder);
//     return newOrder;
//   }

//   async updateStatus(id: string, status: OrderStatus): Promise<Order> {
//     const orderIndex = this.orders.findIndex((o) => o.id === id);
//     if (orderIndex === -1) {
//       throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
//     }

//     const updatedOrder = new Order({
//       ...this.orders[orderIndex],
//       status,
//       updatedAt: new Date(),
//       ...(status === OrderStatus.APPROVED && { approvedAt: new Date() }),
//       ...(status === OrderStatus.DELIVERED && { deliveredAt: new Date() }),
//     });

//     this.orders[orderIndex] = updatedOrder;
//     return updatedOrder;
//   }

//   async getOrderStats() {
//     const totalOrders = this.orders.length;
//     const statusStats = Object.values(OrderStatus).map((status) => ({
//       status,
//       count: this.orders.filter((o) => o.status === status).length,
//     }));

//     const totalRevenue = this.orders
//       .filter((o) => o.totalAmount && o.status === OrderStatus.DELIVERED)
//       .reduce((sum, o) => sum + o.totalAmount!, 0);

//     const avgOrderValue =
//       this.orders.filter((o) => o.totalAmount).reduce((sum, o) => sum + o.totalAmount!, 0) /
//       this.orders.filter((o) => o.totalAmount).length;

//     const avgDeliveryTime =
//       this.orders
//         .filter((o) => o.estimatedDeadline)
//         .reduce((sum, o) => sum + o.estimatedDeadline!, 0) /
//       this.orders.filter((o) => o.estimatedDeadline).length;

//     const urgentOrders = this.orders.filter(
//       (o) =>
//         o.desiredDeadline &&
//         o.desiredDeadline <= 7 &&
//         [
//           OrderStatus.PENDING,
//           OrderStatus.ANALYZING,
//           OrderStatus.QUOTED,
//           OrderStatus.APPROVED,
//           OrderStatus.IN_PRODUCTION,
//         ].includes(o.status),
//     ).length;

//     return {
//       totalOrders,
//       statusStats,
//       totalRevenue: Math.round(totalRevenue * 100) / 100,
//       avgOrderValue: Math.round(avgOrderValue * 100) / 100,
//       avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
//       urgentOrders,
//       recentOrders: this.orders
//         .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
//         .slice(0, 5)
//         .map((o) => ({
//           id: o.id,
//           orderNumber: o.orderNumber,
//           customerName: o.customerName,
//           status: o.status,
//           totalAmount: o.totalAmount,
//           createdAt: o.createdAt,
//         })),
//     };
//   }

//   private getNestedValue(obj: any, path: string): any {
//     return path.split('.').reduce((current, key) => current?.[key], obj);
//   }
// }
