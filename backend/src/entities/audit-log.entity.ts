import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
}

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Profile;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ 
    name: 'action', 
    type: 'enum', 
    enum: AuditAction, 
    nullable: false 
  })
  action: AuditAction;

  @Column({ name: 'entity_type', type: 'varchar', length: 100, nullable: false })
  entityType: string;

  @Column({ name: 'entity_id', type: 'varchar', length: 100, nullable: true })
  entityId: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues: any;

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues: any;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}

