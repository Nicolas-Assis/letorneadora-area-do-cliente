import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddMessageDto {
  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Verificamos seu pedido e ele será enviado hoje.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Se é uma mensagem interna (não visível ao cliente)',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isInternal?: boolean = false;
}

