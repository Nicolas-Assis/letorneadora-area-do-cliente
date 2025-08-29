import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @ManyToOne(() => Order, (o) => o.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;

  @Column('int', { name: 'quantity', default: 1 }) quantity: number;
  @Column('numeric', { name: 'unit_price', precision: 12, scale: 2, default: 0 }) unitPrice: string;
  @Column('numeric', { name: 'total', precision: 12, scale: 2, default: 0 }) total: string;
}
