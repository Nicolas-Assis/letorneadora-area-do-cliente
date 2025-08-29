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
import { Profile } from './profile.entity';
import { QuoteItem } from './quote-item.entity';

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

@Entity({ name: 'quotes' })
export class Quote {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ name: 'profile_id', nullable: false })
  profileId: string;

  @Column({ 
    name: 'status', 
    type: 'enum', 
    enum: QuoteStatus, 
    default: QuoteStatus.DRAFT 
  })
  status: QuoteStatus;

  @Column({ name: 'total', type: 'decimal', precision: 10, scale: 2, nullable: true })
  total: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'valid_until', type: 'timestamp', nullable: true })
  validUntil: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => QuoteItem, (quoteItem) => quoteItem.quote)
  quoteItems: QuoteItem[];
}

