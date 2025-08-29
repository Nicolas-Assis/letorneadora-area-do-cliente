import { ApiProperty } from '@nestjs/swagger';
import { AuditAction } from '../../entities/audit-log.entity';

export class UserSummaryDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 'uuid-do-usuario',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com',
  })
  email: string;
}

export class AuditLogDto {
  @ApiProperty({
    description: 'ID do log de auditoria',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do usuário que executou a ação',
    example: 'uuid-do-usuario',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    description: 'Ação executada',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  action: AuditAction;

  @ApiProperty({
    description: 'Tipo da entidade afetada',
    example: 'Product',
  })
  entityType: string;

  @ApiProperty({
    description: 'ID da entidade afetada',
    example: '123',
    required: false,
  })
  entityId?: string;

  @ApiProperty({
    description: 'Descrição da ação executada',
    example: 'Produto "Peça CNC" foi criado',
  })
  description: string;

  @ApiProperty({
    description: 'Valores antigos da entidade (antes da alteração)',
    example: { name: 'Nome Antigo', price: 100 },
    required: false,
  })
  oldValues?: any;

  @ApiProperty({
    description: 'Valores novos da entidade (após a alteração)',
    example: { name: 'Nome Novo', price: 150 },
    required: false,
  })
  newValues?: any;

  @ApiProperty({
    description: 'Endereço IP do usuário',
    example: '192.168.1.100',
    required: false,
  })
  ipAddress?: string;

  @ApiProperty({
    description: 'User Agent do navegador',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  userAgent?: string;

  @ApiProperty({
    description: 'Data de criação do log',
    example: '2024-08-28T19:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Dados do usuário',
    type: UserSummaryDto,
    required: false,
  })
  user?: UserSummaryDto;
}

