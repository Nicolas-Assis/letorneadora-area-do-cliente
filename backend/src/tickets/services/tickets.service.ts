import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Ticket, TicketStatus } from '../../entities/ticket.entity';
import { TicketMessage } from '../../entities/ticket-message.entity';
import { Profile } from '../../entities/profile.entity';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { AddMessageDto } from '../dto/add-message.dto';
import { FilterTicketsDto } from '../dto/filter-tickets.dto';
import { TicketDto, TicketMessageDto } from '../dto/ticket.dto';
import { TicketFactory } from '../factories/ticket.factory';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketMessage)
    private readonly ticketMessageRepository: Repository<TicketMessage>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly ticketFactory: TicketFactory,
  ) {}

  async create(dto: CreateTicketDto): Promise<TicketDto> {
    // Verificar se perfil existe
    const profile = await this.profileRepository.findOne({
      where: { id: dto.profileId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil do cliente não encontrado');
    }

    // Criar ticket
    const ticket = this.ticketFactory.createTicketFromDto(dto);
    const savedTicket = await this.ticketRepository.save(ticket);

    // Criar mensagem inicial
    const initialMessage = this.ticketFactory.createTicketMessageFromDto(
      { message: dto.message, isInternal: false },
      savedTicket.id,
      dto.profileId
    );

    await this.ticketMessageRepository.save(initialMessage);

    return this.findOneById(savedTicket.id);
  }

  async findAll(filter: FilterTicketsDto): Promise<PaginatedResponseDto<TicketDto>> {
    const { 
      page = 1, 
      limit = 10, 
      profileId, 
      status, 
      priority,
      assignedTo,
      orderId,
      search,
      startDate, 
      endDate, 
      unassigned,
      includeProfile, 
      includeAssignee,
      includeMessages 
    } = filter;

    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket');

    // Aplicar filtros
    if (profileId) {
      queryBuilder.andWhere('ticket.profileId = :profileId', { profileId });
    }

    if (status) {
      queryBuilder.andWhere('ticket.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('ticket.priority = :priority', { priority });
    }

    if (assignedTo) {
      queryBuilder.andWhere('ticket.assignedTo = :assignedTo', { assignedTo });
    }

    if (orderId !== undefined) {
      queryBuilder.andWhere('ticket.orderId = :orderId', { orderId });
    }

    if (search) {
      queryBuilder.andWhere('ticket.subject ILIKE :search', { search: `%${search}%` });
    }

    if (startDate) {
      queryBuilder.andWhere('ticket.createdAt >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      queryBuilder.andWhere('ticket.createdAt <= :endDate', { endDate: new Date(endDate) });
    }

    if (unassigned) {
      queryBuilder.andWhere('ticket.assignedTo IS NULL');
    }

    // Incluir relações se solicitado
    if (includeProfile) {
      queryBuilder.leftJoinAndSelect('ticket.profile', 'profile');
    }

    if (includeMessages) {
      queryBuilder
        .leftJoinAndSelect('ticket.messages', 'messages')
        .leftJoinAndSelect('messages.author', 'messageAuthor')
        .addOrderBy('messages.createdAt', 'ASC');
    }

    // Ordenação
    const sortField = filter.sort || 'createdAt';
    const sortOrder = filter.order || 'DESC';
    queryBuilder.orderBy(`ticket.${sortField}`, sortOrder);

    // Paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [tickets, total] = await queryBuilder.getManyAndCount();

    const ticketDtos = this.ticketFactory.toDTOList(tickets, includeProfile || includeAssignee || includeMessages);

    return new PaginatedResponseDto(
      true,
      'Tickets recuperados com sucesso',
      ticketDtos,
      page,
      limit,
      total,
    );
  }

  async findOneById(id: number, includeRelations = true): Promise<TicketDto> {
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
      .where('ticket.id = :id', { id });

    if (includeRelations) {
      queryBuilder
        .leftJoinAndSelect('ticket.profile', 'profile')
        .leftJoinAndSelect('ticket.messages', 'messages')
        .leftJoinAndSelect('messages.author', 'messageAuthor')
        .addOrderBy('messages.createdAt', 'ASC');
    }

    const ticket = await queryBuilder.getOne();

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    return this.ticketFactory.toDTO(ticket, includeRelations);
  }

  async update(id: number, dto: UpdateTicketDto): Promise<TicketDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    // Verificar se pode ser atualizado
    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Tickets fechados não podem ser alterados');
    }

    // Atualizar campos
    if (dto.status !== undefined) {
      // Validar transições de status
      this.validateStatusTransition(ticket.status, dto.status);
      ticket.status = dto.status;

      // Se status for RESOLVED, definir data de resolução
      if (dto.status === TicketStatus.RESOLVED && !ticket.resolvedAt) {
        ticket.resolvedAt = new Date();
      }

      // Se status for CLOSED, definir data de fechamento
      if (dto.status === TicketStatus.CLOSED && !ticket.closedAt) {
        ticket.closedAt = new Date();
      }
    }

    if (dto.priority !== undefined) {
      ticket.priority = dto.priority;
    }

    if (dto.assignedTo !== undefined) {
      ticket.assignedTo = dto.assignedTo;
    }

    await this.ticketRepository.save(ticket);

    return this.findOneById(id);
  }

  async addMessage(id: number, dto: AddMessageDto, authorId: string): Promise<TicketMessageDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Não é possível adicionar mensagens a tickets fechados');
    }

    // Verificar se autor existe
    const author = await this.profileRepository.findOne({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException('Autor não encontrado');
    }

    // Criar mensagem
    const ticketMessage = this.ticketFactory.createTicketMessageFromDto(dto, id, authorId);
    const savedMessage = await this.ticketMessageRepository.save(ticketMessage);

    // Se o ticket estava aguardando cliente e cliente respondeu, mudar status
    if (ticket.status === TicketStatus.WAITING_CUSTOMER && !dto.isInternal) {
      ticket.status = TicketStatus.IN_PROGRESS;
      await this.ticketRepository.save(ticket);
    }

    // Buscar mensagem com relações
    const messageWithRelations = await this.ticketMessageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['author'],
    });

    return this.ticketFactory.ticketMessageToDTO(messageWithRelations);
  }

  async assign(id: number, assignedTo: string): Promise<TicketDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Tickets fechados não podem ser atribuídos');
    }

    // Verificar se usuário existe
    const assignee = await this.profileRepository.findOne({
      where: { id: assignedTo },
    });

    if (!assignee) {
      throw new NotFoundException('Usuário não encontrado');
    }

    ticket.assignedTo = assignedTo;
    
    // Se ticket estava aberto, mudar para em progresso
    if (ticket.status === TicketStatus.OPEN) {
      ticket.status = TicketStatus.IN_PROGRESS;
    }

    await this.ticketRepository.save(ticket);

    return this.findOneById(id);
  }

  async resolve(id: number): Promise<TicketDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Tickets fechados não podem ser resolvidos');
    }

    ticket.status = TicketStatus.RESOLVED;
    ticket.resolvedAt = new Date();
    await this.ticketRepository.save(ticket);

    return this.findOneById(id);
  }

  async close(id: number): Promise<TicketDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Ticket já está fechado');
    }

    ticket.status = TicketStatus.CLOSED;
    ticket.closedAt = new Date();
    
    // Se não foi resolvido antes, marcar como resolvido também
    if (!ticket.resolvedAt) {
      ticket.resolvedAt = new Date();
    }

    await this.ticketRepository.save(ticket);

    return this.findOneById(id);
  }

  async reopen(id: number): Promise<TicketDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    if (ticket.status !== TicketStatus.CLOSED && ticket.status !== TicketStatus.RESOLVED) {
      throw new BadRequestException('Apenas tickets fechados ou resolvidos podem ser reabertos');
    }

    ticket.status = TicketStatus.IN_PROGRESS;
    ticket.resolvedAt = null;
    ticket.closedAt = null;
    await this.ticketRepository.save(ticket);

    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    await this.ticketRepository.remove(ticket);
  }

  private validateStatusTransition(currentStatus: TicketStatus, newStatus: TicketStatus): void {
    const validTransitions: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
      [TicketStatus.IN_PROGRESS]: [TicketStatus.WAITING_CUSTOMER, TicketStatus.RESOLVED, TicketStatus.CLOSED],
      [TicketStatus.WAITING_CUSTOMER]: [TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED],
      [TicketStatus.RESOLVED]: [TicketStatus.CLOSED, TicketStatus.IN_PROGRESS],
      [TicketStatus.CLOSED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Transição de status inválida: ${currentStatus} -> ${newStatus}`
      );
    }
  }
}

