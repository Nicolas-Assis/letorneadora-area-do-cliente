import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { TicketMessage } from './ticket-message.entity';

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_CUSTOMER = 'WAITING_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ name: 'profile_id', nullable: false })
  profileId: string;

  @Column({ name: 'subject', type: 'varchar', length: 255, nullable: false })
  subject: string;

  @Column({ 
    name: 'status', 
    type: 'enum', 
    enum: TicketStatus, 
    default: TicketStatus.OPEN 
  })
  status: TicketStatus;

  @Column({ 
    name: 'priority', 
    type: 'enum', 
    enum: TicketPriority, 
    default: TicketPriority.MEDIUM 
  })
  priority: TicketPriority;

  @Column({ name: 'order_id', nullable: true })
  orderId: number;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => TicketMessage, (ticketMessage) => ticketMessage.ticket)
  messages: TicketMessage[];
}

