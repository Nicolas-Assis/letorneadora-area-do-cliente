import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { AuditAction } from '../../entities/audit-log.entity';

export class FilterAuditLogsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'ID do usuário para filtrar',
    example: 'uuid-do-usuario',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Ação executada',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @ApiPropertyOptional({
    description: 'Tipo da entidade afetada',
    example: 'Product',
  })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({
    description: 'ID da entidade afetada',
    example: '123',
  })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Termo de busca na descrição',
    example: 'produto criado',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Data de início para filtrar por criação (ISO 8601)',
    example: '2024-08-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de fim para filtrar por criação (ISO 8601)',
    example: '2024-08-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Endereço IP para filtrar',
    example: '192.168.1.100',
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Incluir dados do usuário na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeUser?: boolean = false;
}

