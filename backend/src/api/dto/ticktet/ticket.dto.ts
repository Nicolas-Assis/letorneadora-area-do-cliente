import { ApiProperty } from '@nestjs/swagger';
//import { TicketStatus, TicketPriority } from '../../entities/ticket.entity';

export class ProfileSummaryDto {
  @ApiProperty({
    description: 'ID do perfil',
    example: 'uuid-do-cliente',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '(11) 99999-9999',
    required: false,
  })
  phone?: string;
}

export class TicketMessageDto {
  @ApiProperty({
    description: 'ID da mensagem',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do autor da mensagem',
    example: 'uuid-do-autor',
  })
  authorId: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Olá, estou verificando o status do seu pedido...',
  })
  message: string;

  @ApiProperty({
    description: 'Se é uma mensagem interna (não visível ao cliente)',
    example: false,
  })
  isInternal: boolean;

  @ApiProperty({
    description: 'Data de criação da mensagem',
    example: '2024-08-28T19:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Dados do autor',
    type: ProfileSummaryDto,
    required: false,
  })
  author?: ProfileSummaryDto;
}

export class TicketDto {
  @ApiProperty({
    description: 'ID do ticket',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do perfil do cliente',
    example: 'uuid-do-cliente',
  })
  profileId: string;

  @ApiProperty({
    description: 'Assunto do ticket',
    example: 'Problema com entrega do pedido #123',
  })
  subject: string;

  // @ApiProperty({
  //   description: 'Status do ticket',
  //   enum: TicketStatus,
  //   example: TicketStatus.OPEN,
  // })
  // status: TicketStatus;

  // @ApiProperty({
  //   description: 'Prioridade do ticket',
  //   enum: TicketPriority,
  //   example: TicketPriority.MEDIUM,
  // })
  // priority: TicketPriority;

  @ApiProperty({
    description: 'ID do pedido relacionado',
    example: 1,
    required: false,
  })
  orderId?: number;

  @ApiProperty({
    description: 'ID do usuário responsável',
    example: 'uuid-do-operador',
    required: false,
  })
  assignedTo?: string;

  @ApiProperty({
    description: 'Data de resolução',
    example: '2024-08-29T10:30:00.000Z',
    required: false,
  })
  resolvedAt?: Date;

  @ApiProperty({
    description: 'Data de fechamento',
    example: '2024-08-29T11:00:00.000Z',
    required: false,
  })
  closedAt?: Date;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-08-28T19:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-08-28T19:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Dados do cliente',
    type: ProfileSummaryDto,
    required: false,
  })
  profile?: ProfileSummaryDto;

  @ApiProperty({
    description: 'Usuário responsável',
    type: ProfileSummaryDto,
    required: false,
  })
  assignee?: ProfileSummaryDto;

  @ApiProperty({
    description: 'Mensagens do ticket',
    type: [TicketMessageDto],
    required: false,
  })
  messages?: TicketMessageDto[];
}

