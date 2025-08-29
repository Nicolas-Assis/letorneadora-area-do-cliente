// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, FindOptionsWhere } from 'typeorm';
// import { Quote, QuoteStatus } from '../api/entities/quote.entity';
// import { QuoteItem } from '../api/entities/quote-item.entity';
// import { Product } from '../api/entities/product.entity';
// import { Users } from '../api/entities/user.entity';
// import { CreateQuoteDto } from '../api/dto/quote/create-quote.dto';
// import { UpdateQuoteDto } from '../api/dto/quote/update-quote.dto';
// import { FilterQuotesDto } from '../api/dto/quote/filter-quotes.dto';
// import { QuoteDto } from '../api/dto/quote/quote.dto';
// import { QuoteFactory } from '../factories/quote.factory';
// import { PaginationQueryDto } from '../api/dto/common.dto';

// @Injectable()
// export class QuotesService {
//   constructor(
//     @InjectRepository(Quote)
//     private readonly quoteRepository: Repository<Quote>,
//     @InjectRepository(QuoteItem)
//     private readonly quoteItemRepository: Repository<QuoteItem>,
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,
//     @InjectRepository(Users)
//     private readonly profileRepository: Repository<Users>,
//     private readonly quoteFactory: QuoteFactory,
//   ) {}

//   async create(dto: CreateQuoteDto): Promise<QuoteDto> {
//     const user = await this.profileRepository.findOne({ where: { id: dto.profileId } });
//     if (!user) throw new NotFoundException('Perfil do cliente não encontrado');

//     const productIds = dto.items.map((i) => i.productId);
//     const products = await this.productRepository.findByIds(productIds);
//     if (products.length !== productIds.length)
//       throw new BadRequestException('Um ou mais produtos não foram encontrados');

//     const quote = this.quoteFactory.createQuoteFromDto(dto);
//     const savedQuote = await this.quoteRepository.save(quote);

//     const quoteItems = dto.items.map((itemDto) =>
//       this.quoteFactory.createQuoteItemFromDto(itemDto, savedQuote.id),
//     );
//     await this.quoteItemRepository.save(quoteItems);

//     await this.updateQuoteTotal(savedQuote.id);

//     return this.findOneById(savedQuote.id);
//   }

//   /**
//    * Busca com paginação (padrão semelhante ao exemplo de InvoicesNotesDataService)
//    * Retorna PaginationQueryDto (compatível com controller existente)
//    */
//   async findAll(filter: FilterQuotesDto): Promise<PaginationQueryDto> {
//     const {
//       profileId,
//       status,
//       startDate,
//       endDate,
//       minTotal,
//       maxTotal,
//       expired,
//       includeProfile,
//       includeItems,
//       // page = 1,
//       // limit = 10,
//       // sort = 'createdAt',
//       // order = 'DESC',
//     } = filter || {};

//     const where: FindOptionsWhere<Quote> = {};
//     if (profileId) Object.assign(where, { profile: { id: profileId } });
//     if (status) Object.assign(where, { status });
//     if (minTotal !== undefined) Object.assign(where, { total: () => `>= ${minTotal}` });
//     if (maxTotal !== undefined) Object.assign(where, { total: () => `<= ${maxTotal}` });

//     const qb = this.quoteRepository.createQueryBuilder('quote');

//     if (profileId) {
//       qb.andWhere('quote.profileId = :profileId', { profileId });
//     }
//     if (status) {
//       qb.andWhere('quote.status = :status', { status });
//     }
//     if (startDate) {
//       qb.andWhere('quote.createdAt >= :startDate', { startDate: new Date(startDate) });
//     }
//     if (endDate) {
//       qb.andWhere('quote.createdAt <= :endDate', { endDate: new Date(endDate) });
//     }
//     if (minTotal !== undefined) {
//       qb.andWhere('quote.total >= :minTotal', { minTotal });
//     }
//     if (maxTotal !== undefined) {
//       qb.andWhere('quote.total <= :maxTotal', { maxTotal });
//     }
//     if (expired) {
//       qb.andWhere('quote.validUntil < :now', { now: new Date() });
//     }

//     if (includeProfile) qb.leftJoinAndSelect('quote.profile', 'profile');
//     if (includeItems) {
//       qb.leftJoinAndSelect('quote.quoteItems', 'quoteItems').leftJoinAndSelect(
//         'quoteItems.product',
//         'product',
//       );
//     }

//     // Segurança: validar campos permitidos para ordenação
//     // const allowedSorts = ['createdAt', 'total', 'validUntil', 'status', 'id'];
//     // const sortField = allowedSorts.includes(sort) ? sort : 'createdAt';
//     // const orderDir = order && order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
//     // qb.orderBy(`quote.${sortField}`, orderDir);

//     // const skip = Math.max(0, page - 1) * limit;
//     // qb.skip(skip).take(limit);

//     const [quotes, total] = await qb.getManyAndCount();
//     const quoteDtos = this.quoteFactory.toDTOList(quotes, !!(includeProfile || includeItems));

//     const paginationResult = new PaginationQueryDto();
//     // paginationResult.success = true;
//     // paginationResult.message = 'Orçamentos recuperados com sucesso';
//     // paginationResult.data = quoteDtos;
//     // paginationResult.page = page;
//     // paginationResult.limit = limit;
//     // paginationResult.total = total;
//     return paginationResult;
//   }

//   async findOneById(id: number, includeRelations = true): Promise<QuoteDto> {
//     const qb = this.quoteRepository.createQueryBuilder('quote').where('quote.id = :id', { id });

//     if (includeRelations) {
//       qb.leftJoinAndSelect('quote.profile', 'profile')
//         .leftJoinAndSelect('quote.quoteItems', 'quoteItems')
//         .leftJoinAndSelect('quoteItems.product', 'product');
//     }

//     const quote = await qb.getOne();
//     if (!quote) throw new NotFoundException('Orçamento não encontrado');

//     return this.quoteFactory.toDTO(quote, includeRelations);
//   }

//   async update(id: number, dto: UpdateQuoteDto): Promise<QuoteDto> {
//     const quote = await this.quoteRepository.findOne({ where: { id } });
//     if (!quote) throw new NotFoundException('Orçamento não encontrado');

//     if (quote.status === QuoteStatus.APPROVED || quote.status === QuoteStatus.REJECTED) {
//       throw new BadRequestException('Orçamentos aprovados ou rejeitados não podem ser alterados');
//     }

//     if (dto.status !== undefined) quote.status = dto.status;
//     if (dto.notes !== undefined) quote.notes = dto.notes;
//     if (dto.validUntil !== undefined)
//       quote.validUntil = dto.validUntil ? new Date(dto.validUntil) : null;

//     await this.quoteRepository.save(quote);

//     if (dto.items !== undefined) {
//       await this.updateQuoteItems(id, dto.items);
//     }

//     await this.updateQuoteTotal(id);

//     return this.findOneById(id);
//   }

//   async submit(id: number): Promise<QuoteDto> {
//     const quote = await this.quoteRepository.findOne({ where: { id }, relations: ['quoteItems'] });
//     if (!quote) throw new NotFoundException('Orçamento não encontrado');

//     if (quote.status !== QuoteStatus.DRAFT)
//       throw new BadRequestException('Apenas orçamentos em rascunho podem ser enviados');
//     if (!quote.quoteItems || quote.quoteItems.length === 0)
//       throw new BadRequestException('Orçamento deve ter pelo menos um item');

//     const itemsWithoutPrice = quote.quoteItems.filter((item) => !item.unitPrice);
//     if (itemsWithoutPrice.length > 0)
//       throw new BadRequestException('Todos os itens devem ter preço definido antes de enviar');

//     quote.status = QuoteStatus.PENDING;
//     await this.quoteRepository.save(quote);

//     return this.findOneById(id);
//   }

//   async approve(id: number): Promise<QuoteDto> {
//     const quote = await this.quoteRepository.findOne({ where: { id } });
//     if (!quote) throw new NotFoundException('Orçamento não encontrado');
//     if (quote.status !== QuoteStatus.PENDING)
//       throw new BadRequestException('Apenas orçamentos pendentes podem ser aprovados');

//     quote.status = QuoteStatus.APPROVED;
//     await this.quoteRepository.save(quote);

//     return this.findOneById(id);
//   }

//   async reject(id: number): Promise<QuoteDto> {
//     const quote = await this.quoteRepository.findOne({ where: { id } });
//     if (!quote) throw new NotFoundException('Orçamento não encontrado');
//     if (quote.status !== QuoteStatus.PENDING)
//       throw new BadRequestException('Apenas orçamentos pendentes podem ser rejeitados');

//     quote.status = QuoteStatus.REJECTED;
//     await this.quoteRepository.save(quote);

//     return this.findOneById(id);
//   }

//   async remove(id: number): Promise<void> {
//     const quote = await this.quoteRepository.findOne({ where: { id } });
//     if (!quote) throw new NotFoundException('Orçamento não encontrado');
//     if (quote.status === QuoteStatus.APPROVED)
//       throw new BadRequestException('Orçamentos aprovados não podem ser removidos');

//     await this.quoteRepository.remove(quote);
//   }

//   private async updateQuoteItems(quoteId: number, items: any[]): Promise<void> {
//     await this.quoteItemRepository.delete({ quoteId });

//     const productIds = items.map((i) => i.productId);
//     const products = await this.productRepository.findByIds(productIds);
//     if (products.length !== productIds.length)
//       throw new BadRequestException('Um ou mais produtos não foram encontrados');

//     const quoteItems = items.map((itemDto) =>
//       this.quoteFactory.createQuoteItemFromDto(itemDto, quoteId),
//     );
//     await this.quoteItemRepository.save(quoteItems);
//   }

//   private async updateQuoteTotal(quoteId: number): Promise<void> {
//     const quoteItems = await this.quoteItemRepository.find({ where: { quoteId } });
//     const total = this.quoteFactory.calculateTotal(quoteItems);
//     await this.quoteRepository.update(quoteId, { total });
//   }

//   /**
//    * Método de utilidade para contar orçamentos (padrão semelhante ao exemplo)
//    */
//   async getTotals(
//     profileId: number,
//     filter: FindOptionsWhere<Quote> = {},
//   ): Promise<{ total: number; totalPending: number; totalExpired: number }> {
//     const where = { ...filter, profile: { id: profileId } };

//     const total = await this.quoteRepository.createQueryBuilder('quote').where(where).getCount();

//     const totalPending = await this.quoteRepository
//       .createQueryBuilder('quote')
//       .where(where)
//       .andWhere('quote.status = :status', { status: QuoteStatus.PENDING })
//       .getCount();

//     const totalExpired = await this.quoteRepository
//       .createQueryBuilder('quote')
//       .where(where)
//       .andWhere('quote.validUntil < :now', { now: new Date() })
//       .getCount();

//     return { total, totalPending, totalExpired };
//   }
// }
