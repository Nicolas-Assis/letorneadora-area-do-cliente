import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { Profile } from './profile.entity';

@Entity({ name: 'ticket_messages' })
export class TicketMessage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ name: 'ticket_id', nullable: false })
  ticketId: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'author_id' })
  author: Profile;

  @Column({ name: 'author_id', nullable: false })
  authorId: string;

  @Column({ name: 'message', type: 'text', nullable: false })
  message: string;

  @Column({ name: 'is_internal', type: 'boolean', default: false })
  isInternal: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}

