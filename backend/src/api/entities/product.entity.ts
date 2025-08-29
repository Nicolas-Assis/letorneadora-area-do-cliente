import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ProductCategory } from './product-category.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column('text', { name: 'name' }) name: string;
  @Column('text', { name: 'slug' }) slug: string;

  @Column('text', { name: 'sku', nullable: true })
  sku: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('numeric', { name: 'price', precision: 12, scale: 2, default: 0 })
  price: string;

  @Column('boolean', { name: 'active', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => ProductImage, (pi) => pi.product)
  images: ProductImage[];

  @OneToMany(() => ProductCategory, (pc) => pc.product)
  productCategories: ProductCategory[];
}
