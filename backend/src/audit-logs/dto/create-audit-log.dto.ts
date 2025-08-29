import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';
import { AuditAction } from '../../entities/audit-log.entity';

export class CreateAuditLogDto {
  @ApiProperty({
    description: 'ID do usuário que executou a ação',
    example: 'uuid-do-usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Ação executada',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({
    description: 'Tipo da entidade afetada',
    example: 'Product',
  })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({
    description: 'ID da entidade afetada',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiProperty({
    description: 'Descrição da ação executada',
    example: 'Produto "Peça CNC" foi criado',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Valores antigos da entidade (antes da alteração)',
    example: { name: 'Nome Antigo', price: 100 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  oldValues?: any;

  @ApiProperty({
    description: 'Valores novos da entidade (após a alteração)',
    example: { name: 'Nome Novo', price: 150 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  newValues?: any;

  @ApiProperty({
    description: 'Endereço IP do usuário',
    example: '192.168.1.100',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'User Agent do navegador',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

