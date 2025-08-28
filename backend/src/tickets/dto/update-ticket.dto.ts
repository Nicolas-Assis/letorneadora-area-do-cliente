import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TicketStatus, TicketPriority } from '../../entities/ticket.entity';

export class UpdateTicketDto {
  @ApiProperty({
    description: 'Status do ticket',
    enum: TicketStatus,
    example: TicketStatus.IN_PROGRESS,
    required: false,
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({
    description: 'Prioridade do ticket',
    enum: TicketPriority,
    example: TicketPriority.HIGH,
    required: false,
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({
    description: 'ID do usuário responsável pelo ticket',
    example: 'uuid-do-operador',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;
}

