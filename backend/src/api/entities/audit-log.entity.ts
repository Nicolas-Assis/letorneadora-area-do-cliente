import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUser } from './auth-user.entity';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @ManyToOne(() => AuthUser, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'actor_id' })
  actor: AuthUser | null;

  @Column('text', { name: 'entity' }) entity: string;
  @Column('text', { name: 'entity_id', nullable: true }) entityId: string | null;
  @Column('text', { name: 'action' }) action: string;
  @Column('jsonb', { name: 'before', nullable: true }) before: Record<string, any> | null;
  @Column('jsonb', { name: 'after', nullable: true }) after: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
