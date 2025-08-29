import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './adresses.entity';
import { Ticket } from './ticket.entity';
import { TicketMessage } from './ticket-message.entity';
import { Quote } from './quote.entity';
import { Order } from './order.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('text', { name: 'phone', nullable: true })
  phone: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Address, (a) => a.profile)
  addresses: Address[];

  @OneToMany(() => Ticket, (t) => t.profile)
  tickets: Ticket[];

  @OneToMany(() => TicketMessage, (tm) => tm.author)
  messages: TicketMessage[];

  @OneToMany(() => Quote, (q) => q.profile)
  quotes: Quote[];

  @OneToMany(() => Order, (o) => o.profile)
  orders: Order[];
}
