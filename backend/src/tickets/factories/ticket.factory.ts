import { Injectable } from '@nestjs/common';
import { Ticket, TicketStatus } from '../../entities/ticket.entity';
import { TicketMessage } from '../../entities/ticket-message.entity';
import { TicketDto, TicketMessageDto, ProfileSummaryDto } from '../dto/ticket.dto';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { AddMessageDto } from '../dto/add-message.dto';

@Injectable()
export class TicketFactory {
  createTicketFromDto(dto: CreateTicketDto): Ticket {
    const ticket = new Ticket();
    
    ticket.profileId = dto.profileId;
    ticket.subject = dto.subject;
    ticket.status = TicketStatus.OPEN;
    ticket.priority = dto.priority;
    ticket.orderId = dto.orderId;
    
    return ticket;
  }

  createTicketMessageFromDto(dto: AddMessageDto, ticketId: number, authorId: string): TicketMessage {
    const ticketMessage = new TicketMessage();
    
    ticketMessage.ticketId = ticketId;
    ticketMessage.authorId = authorId;
    ticketMessage.message = dto.message;
    ticketMessage.isInternal = dto.isInternal || false;
    
    return ticketMessage;
  }

  toDTO(ticket: Ticket, includeRelations = false): TicketDto {
    const dto = new TicketDto();
    
    dto.id = ticket.id;
    dto.profileId = ticket.profileId;
    dto.subject = ticket.subject;
    dto.status = ticket.status;
    dto.priority = ticket.priority;
    dto.orderId = ticket.orderId;
    dto.assignedTo = ticket.assignedTo;
    dto.resolvedAt = ticket.resolvedAt;
    dto.closedAt = ticket.closedAt;
    dto.createdAt = ticket.createdAt;
    dto.updatedAt = ticket.updatedAt;

    if (includeRelations) {
      // Incluir dados do cliente se existir
      if (ticket.profile) {
        dto.profile = {
          id: ticket.profile.id,
          name: ticket.profile.name,
          phone: ticket.profile.phone,
        } as ProfileSummaryDto;
      }

      // Incluir mensagens se existirem
      if (ticket.messages && ticket.messages.length > 0) {
        dto.messages = ticket.messages.map(message => this.ticketMessageToDTO(message));
      }
    }

    return dto;
  }

  ticketMessageToDTO(ticketMessage: TicketMessage): TicketMessageDto {
    const dto = new TicketMessageDto();
    
    dto.id = ticketMessage.id;
    dto.authorId = ticketMessage.authorId;
    dto.message = ticketMessage.message;
    dto.isInternal = ticketMessage.isInternal;
    dto.createdAt = ticketMessage.createdAt;

    // Incluir dados do autor se existir
    if (ticketMessage.author) {
      dto.author = {
        id: ticketMessage.author.id,
        name: ticketMessage.author.name,
        phone: ticketMessage.author.phone,
      } as ProfileSummaryDto;
    }

    return dto;
  }

  toDTOList(tickets: Ticket[], includeRelations = false): TicketDto[] {
    return tickets.map(ticket => this.toDTO(ticket, includeRelations));
  }
}

