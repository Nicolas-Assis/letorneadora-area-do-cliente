import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual, LessThan } from 'typeorm';
import { Quote, QuoteStatus } from '../../entities/quote.entity';
import { QuoteItem } from '../../entities/quote-item.entity';
import { Product } from '../../entities/product.entity';
import { Profile } from '../../entities/profile.entity';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { UpdateQuoteDto } from '../dto/update-quote.dto';
import { FilterQuotesDto } from '../dto/filter-quotes.dto';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteFactory } from '../factories/quote.factory';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
    @InjectRepository(QuoteItem)
    private readonly quoteItemRepository: Repository<QuoteItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly quoteFactory: QuoteFactory,
  ) {}

  async create(dto: CreateQuoteDto): Promise<QuoteDto> {
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

    // Criar orçamento
    const quote = this.quoteFactory.createQuoteFromDto(dto);
    const savedQuote = await this.quoteRepository.save(quote);

    // Criar itens do orçamento
    const quoteItems = dto.items.map(itemDto => 
      this.quoteFactory.createQuoteItemFromDto(itemDto, savedQuote.id)
    );

    await this.quoteItemRepository.save(quoteItems);

    // Calcular e atualizar total
    await this.updateQuoteTotal(savedQuote.id);

    return this.findOneById(savedQuote.id);
  }

  async findAll(filter: FilterQuotesDto): Promise<PaginatedResponseDto<QuoteDto>> {
    const { 
      page = 1, 
      limit = 10, 
      profileId, 
      status, 
      startDate, 
      endDate, 
      minTotal, 
      maxTotal, 
      expired,
      includeProfile, 
      includeItems 
    } = filter;

    const queryBuilder = this.quoteRepository.createQueryBuilder('quote');

    // Aplicar filtros
    if (profileId) {
      queryBuilder.andWhere('quote.profileId = :profileId', { profileId });
    }

    if (status) {
      queryBuilder.andWhere('quote.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('quote.createdAt >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      queryBuilder.andWhere('quote.createdAt <= :endDate', { endDate: new Date(endDate) });
    }

    if (minTotal !== undefined) {
      queryBuilder.andWhere('quote.total >= :minTotal', { minTotal });
    }

    if (maxTotal !== undefined) {
      queryBuilder.andWhere('quote.total <= :maxTotal', { maxTotal });
    }

    if (expired) {
      queryBuilder.andWhere('quote.validUntil < :now', { now: new Date() });
    }

    // Incluir relações se solicitado
    if (includeProfile) {
      queryBuilder.leftJoinAndSelect('quote.profile', 'profile');
    }

    if (includeItems) {
      queryBuilder
        .leftJoinAndSelect('quote.quoteItems', 'quoteItems')
        .leftJoinAndSelect('quoteItems.product', 'product');
    }

    // Ordenação
    const sortField = filter.sort || 'createdAt';
    const sortOrder = filter.order || 'DESC';
    queryBuilder.orderBy(`quote.${sortField}`, sortOrder);

    // Paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [quotes, total] = await queryBuilder.getManyAndCount();

    const quoteDtos = this.quoteFactory.toDTOList(quotes, includeProfile || includeItems);

    return new PaginatedResponseDto(
      true,
      'Orçamentos recuperados com sucesso',
      quoteDtos,
      page,
      limit,
      total,
    );
  }

  async findOneById(id: number, includeRelations = true): Promise<QuoteDto> {
    const queryBuilder = this.quoteRepository.createQueryBuilder('quote')
      .where('quote.id = :id', { id });

    if (includeRelations) {
      queryBuilder
        .leftJoinAndSelect('quote.profile', 'profile')
        .leftJoinAndSelect('quote.quoteItems', 'quoteItems')
        .leftJoinAndSelect('quoteItems.product', 'product');
    }

    const quote = await queryBuilder.getOne();

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    return this.quoteFactory.toDTO(quote, includeRelations);
  }

  async update(id: number, dto: UpdateQuoteDto): Promise<QuoteDto> {
    const quote = await this.quoteRepository.findOne({ where: { id } });

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    // Verificar se pode ser atualizado
    if (quote.status === QuoteStatus.APPROVED || quote.status === QuoteStatus.REJECTED) {
      throw new BadRequestException('Orçamentos aprovados ou rejeitados não podem ser alterados');
    }

    // Atualizar campos
    if (dto.status !== undefined) {
      quote.status = dto.status;
    }

    if (dto.notes !== undefined) {
      quote.notes = dto.notes;
    }

    if (dto.validUntil !== undefined) {
      quote.validUntil = dto.validUntil ? new Date(dto.validUntil) : null;
    }

    await this.quoteRepository.save(quote);

    // Atualizar itens se fornecidos
    if (dto.items !== undefined) {
      await this.updateQuoteItems(id, dto.items);
    }

    // Recalcular total
    await this.updateQuoteTotal(id);

    return this.findOneById(id);
  }

  async approve(id: number): Promise<QuoteDto> {
    const quote = await this.quoteRepository.findOne({ where: { id } });

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    if (quote.status !== QuoteStatus.PENDING) {
      throw new BadRequestException('Apenas orçamentos pendentes podem ser aprovados');
    }

    quote.status = QuoteStatus.APPROVED;
    await this.quoteRepository.save(quote);

    return this.findOneById(id);
  }

  async reject(id: number): Promise<QuoteDto> {
    const quote = await this.quoteRepository.findOne({ where: { id } });

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    if (quote.status !== QuoteStatus.PENDING) {
      throw new BadRequestException('Apenas orçamentos pendentes podem ser rejeitados');
    }

    quote.status = QuoteStatus.REJECTED;
    await this.quoteRepository.save(quote);

    return this.findOneById(id);
  }

  async submit(id: number): Promise<QuoteDto> {
    const quote = await this.quoteRepository.findOne({ 
      where: { id },
      relations: ['quoteItems']
    });

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    if (quote.status !== QuoteStatus.DRAFT) {
      throw new BadRequestException('Apenas orçamentos em rascunho podem ser enviados');
    }

    if (!quote.quoteItems || quote.quoteItems.length === 0) {
      throw new BadRequestException('Orçamento deve ter pelo menos um item');
    }

    // Verificar se todos os itens têm preço
    const itemsWithoutPrice = quote.quoteItems.filter(item => !item.unitPrice);
    if (itemsWithoutPrice.length > 0) {
      throw new BadRequestException('Todos os itens devem ter preço definido antes de enviar');
    }

    quote.status = QuoteStatus.PENDING;
    await this.quoteRepository.save(quote);

    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const quote = await this.quoteRepository.findOne({ where: { id } });

    if (!quote) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    if (quote.status === QuoteStatus.APPROVED) {
      throw new BadRequestException('Orçamentos aprovados não podem ser removidos');
    }

    await this.quoteRepository.remove(quote);
  }

  private async updateQuoteItems(quoteId: number, items: any[]): Promise<void> {
    // Remover itens existentes
    await this.quoteItemRepository.delete({ quoteId });

    // Verificar se todos os produtos existem
    const productIds = items.map(item => item.productId);
    const products = await this.productRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new BadRequestException('Um ou mais produtos não foram encontrados');
    }

    // Criar novos itens
    const quoteItems = items.map(itemDto => 
      this.quoteFactory.createQuoteItemFromDto(itemDto, quoteId)
    );

    await this.quoteItemRepository.save(quoteItems);
  }

  private async updateQuoteTotal(quoteId: number): Promise<void> {
    const quoteItems = await this.quoteItemRepository.find({
      where: { quoteId },
    });

    const total = this.quoteFactory.calculateTotal(quoteItems);

    await this.quoteRepository.update(quoteId, { total });
  }
}

