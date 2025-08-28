import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsEnum, IsDateString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { TicketStatus, TicketPriority } from '../../entities/ticket.entity';

export class FilterTicketsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'ID do perfil do cliente para filtrar',
    example: 'uuid-do-cliente',
  })
  @IsOptional()
  @IsString()
  profileId?: string;

  @ApiPropertyOptional({
    description: 'Status do ticket',
    enum: TicketStatus,
    example: TicketStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({
    description: 'Prioridade do ticket',
    enum: TicketPriority,
    example: TicketPriority.HIGH,
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({
    description: 'ID do usuário responsável',
    example: 'uuid-do-operador',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'ID do pedido relacionado',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  orderId?: number;

  @ApiPropertyOptional({
    description: 'Termo de busca (assunto)',
    example: 'entrega',
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
    description: 'Filtrar apenas tickets não atribuídos',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  unassigned?: boolean;

  @ApiPropertyOptional({
    description: 'Incluir dados do cliente na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeProfile?: boolean = false;

  @ApiPropertyOptional({
    description: 'Incluir dados do responsável na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeAssignee?: boolean = false;

  @ApiPropertyOptional({
    description: 'Incluir mensagens do ticket na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeMessages?: boolean = false;
}

