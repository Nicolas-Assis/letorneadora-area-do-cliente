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
import { Quote } from './quote.entity';
import { OrderItem } from './order-item.entity';
import { OrderEvent } from './order-events.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  READY = 'READY',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column('varchar', { name: 'user_id', nullable: true })
  userId: string;

  @Column('varchar', { name: 'user_email', nullable: true })
  userEmail: string;

  @ManyToOne(() => Quote, (q) => q.orders, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote | null;

  @Column('enum', { name: 'status', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column('numeric', { name: 'total', precision: 12, scale: 2, default: 0 })
  total: number;

  @Column('text', { name: 'notes', nullable: true })
  notes: string;

  @Column('timestamptz', { name: 'estimated_delivery', nullable: true })
  estimatedDelivery: Date;

  @Column('timestamptz', { name: 'delivered_at', nullable: true })
  deliveredAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => OrderItem, (oi) => oi.order)
  orderItems: OrderItem[];

  @OneToMany(() => OrderEvent, (oe) => oe.order)
  events: OrderEvent[];
}

