import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
// import { QuoteStatus } from '../../entities/quote.entity';
import { CreateQuoteItemDto } from './create-quote.dto';

export class UpdateQuoteDto {
  // @ApiProperty({
  //   description: 'Status do orçamento',
  //   enum: QuoteStatus,
  //   example: QuoteStatus.PENDING,
  //   required: false,
  // })
  // @IsOptional()
  // @IsEnum(QuoteStatus)
  // status?: QuoteStatus;

  @ApiProperty({
    description: 'Observações do orçamento',
    example: 'Orçamento atualizado com novos requisitos',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Data de validade do orçamento (ISO 8601)',
    example: '2024-09-30T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiProperty({
    description: 'Itens do orçamento (substitui todos os itens existentes)',
    type: [CreateQuoteItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items?: CreateQuoteItemDto[];
}
