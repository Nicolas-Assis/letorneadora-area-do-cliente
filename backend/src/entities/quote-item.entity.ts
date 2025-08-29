import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Quote } from './quote.entity';

@Entity({ name: 'quote_items' })
export class QuoteItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Quote, (quote) => quote.quoteItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @Column({ name: 'quote_id', nullable: false })
  quoteId: number;

  @ManyToOne(() => Product, (product) => product.quoteItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @Column({ name: 'quantity', type: 'decimal', precision: 10, scale: 2, nullable: false })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number;
}

