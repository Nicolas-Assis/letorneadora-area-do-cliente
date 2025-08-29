import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
// import { TicketPriority } from '../../entities/ticket.entity';

export class CreateTicketDto {
  @ApiProperty({
    description: 'ID do perfil do cliente',
    example: 'uuid-do-cliente',
  })
  @IsString()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({
    description: 'Assunto do ticket',
    example: 'Problema com entrega do pedido #123',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Mensagem inicial do ticket',
    example: 'Meu pedido deveria ter chegado ontem, mas ainda não foi entregue. Poderiam verificar o status?',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  // @ApiProperty({
  //   description: 'Prioridade do ticket',
  //   enum: TicketPriority,
  //   example: TicketPriority.MEDIUM,
  //   required: false,
  // })
  // @IsOptional()
  // @IsEnum(TicketPriority)
  // priority?: TicketPriority = TicketPriority.MEDIUM;

  @ApiProperty({
    description: 'ID do pedido relacionado (se aplicável)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  orderId?: number;
}

