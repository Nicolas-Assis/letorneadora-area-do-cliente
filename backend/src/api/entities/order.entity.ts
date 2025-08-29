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
import { Quote } from './quote.entity';
import { OrderItem } from './order-item.entity';
import { OrderEvent } from './order-events.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

//  @ManyToOne(() => User, (u) => u.orders, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profile_id' })
  profile: User | null;

  @ManyToOne(() => Quote, (q) => q.orders, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote | null;

  @Column('text', { name: 'status' }) status: string;
  @Column('numeric', { name: 'total', precision: 12, scale: 2, default: 0 }) total: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;

  @OneToMany(() => OrderItem, (oi) => oi.order)
  items: OrderItem[];

  @OneToMany(() => OrderEvent, (oe) => oe.order)
  events: OrderEvent[];
}
