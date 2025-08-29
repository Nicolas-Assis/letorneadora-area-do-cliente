import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users', schema: 'auth' })
export class AuthUser {
  @PrimaryColumn('uuid', { name: 'id' })
  id: string;

  @Column('text', { name: 'email', nullable: true })
  email?: string | null;
}
  