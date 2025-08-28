import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  OPERATOR = 'operator',
}

export class User {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'user_123',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '(11) 99999-9999',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa LTDA',
    required: false,
  })
  company?: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90',
    required: false,
  })
  cnpj?: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Indica se o usuário está ativo',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Indica se o email foi verificado',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-20T15:45:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Data do último login',
    example: '2024-01-25T09:15:00.000Z',
    required: false,
  })
  lastLoginAt?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

