import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity({ name: 'warehouses' })
export class Warehouse {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'code', nullable: false, unique: true })
  code: string;

  @OneToMany(() => Inventory, (inventory) => inventory.warehouse)
  inventory: Inventory[];
}

