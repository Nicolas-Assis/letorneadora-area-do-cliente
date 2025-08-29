import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductImage } from './product-image.entity';
import { Inventory } from './inventory.entity';
import { OrderItem } from './order-item.entity';
import { QuoteItem } from './quote-item.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'slug', nullable: false, unique: true })
  slug: string;

  @Column({ name: 'active', nullable: false, default: true })
  active: boolean;

  @Column({ name: 'available', nullable: false, default: true })
  available: boolean;

  @Column({ name: 'min_stock', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  minStock: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.product)
  productCategories: ProductCategory[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventory: Inventory[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => QuoteItem, (quoteItem) => quoteItem.product)
  quoteItems: QuoteItem[];
}

