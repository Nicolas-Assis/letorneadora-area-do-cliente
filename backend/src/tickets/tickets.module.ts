import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './controllers/tickets.controller';
import { TicketsService } from './services/tickets.service';
import { TicketFactory } from './factories/ticket.factory';
import { Ticket } from '../entities/ticket.entity';
import { TicketMessage } from '../entities/ticket-message.entity';
import { Profile } from '../entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketMessage, Profile]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, TicketFactory],
  exports: [TicketsService, TicketFactory],
})
export class TicketsModule {}

