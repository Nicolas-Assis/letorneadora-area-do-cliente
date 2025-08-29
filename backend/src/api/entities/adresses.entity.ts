import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
//import { User } from './user.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

//  @ManyToOne(() => User, (u) => u.addresses, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profile_id' })
  profile: User | null;

  @Column('text', { name: 'label', nullable: true }) label: string | null;
  @Column('text', { name: 'zip', nullable: true }) zip: string | null;
  @Column('text', { name: 'street', nullable: true }) street: string | null;
  @Column('text', { name: 'number', nullable: true }) number: string | null;
  @Column('text', { name: 'complement', nullable: true }) complement: string | null;
  @Column('text', { name: 'district', nullable: true }) district: string | null;
  @Column('text', { name: 'city', nullable: true }) city: string | null;
  @Column('text', { name: 'state', nullable: true }) state: string | null;

  @Column('boolean', { name: 'is_default', default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
