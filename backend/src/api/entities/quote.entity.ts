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
import { QuoteItem } from './quote-item.entity';
import { Order } from './order.entity';

@Entity({ name: 'quotes' })
export class Quote {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

//  @ManyToOne(() => User, (u) => u.quotes, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profile_id' })
  profile: User | null;

  @Column('text', { name: 'status' }) status: string;
  @Column('text', { name: 'notes', nullable: true }) notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;

  @OneToMany(() => QuoteItem, (qi) => qi.quote)
  items: QuoteItem[];

  @OneToMany(() => Order, (o) => o.quote)
  orders: Order[];
}
