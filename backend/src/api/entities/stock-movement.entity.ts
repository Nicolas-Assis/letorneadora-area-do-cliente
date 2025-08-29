import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';

export type MovementType = 'IN' | 'OUT' | 'ADJUST';

@Entity({ name: 'stock_movements' })
export class StockMovement {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Warehouse, (w) => w.movements, { nullable: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column('text', { name: 'type' })
  type: MovementType;

  @Column('int', { name: 'quantity' })
  quantity: number;

  @Column('text', { name: 'reason', nullable: true })
  reason: string | null;

  @Column('jsonb', { name: 'meta', nullable: true })
  meta: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
