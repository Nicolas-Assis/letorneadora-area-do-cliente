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
//import { User } from './user.entity';
import { TicketMessage } from './ticket-message.entity';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

//  @ManyToOne(() => User, (u) => u.tickets, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profile_id' })
  profile: User | null;

  @Column('text', { name: 'subject', nullable: true }) subject: string | null;
  @Column('text', { name: 'status' }) status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => TicketMessage, (m) => m.ticket)
  messages: TicketMessage[];
}
