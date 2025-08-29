import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Inventory } from './inventory.entity';
import { StockMovement } from './stock-movement.entity';

@Entity({ name: 'warehouses' })
export class Warehouse {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column('text', { name: 'name' }) name: string;

  @Column('text', { name: 'code', nullable: true })
  code: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Inventory, (i) => i.warehouse)
  inventory: Inventory[];

  @OneToMany(() => StockMovement, (m) => m.warehouse)
  movements: StockMovement[];
}
