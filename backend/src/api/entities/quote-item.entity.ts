import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quote } from './quote.entity';
import { Product } from './product.entity';

@Entity({ name: 'quote_items' })
export class QuoteItem {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @ManyToOne(() => Quote, (q) => q.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;

  @Column('int', { name: 'quantity', default: 1 }) quantity: number;
  @Column('numeric', { name: 'unit_price', precision: 12, scale: 2, default: 0 }) unitPrice: string;
  @Column('numeric', { name: 'total', precision: 12, scale: 2, default: 0 }) total: string;
}
