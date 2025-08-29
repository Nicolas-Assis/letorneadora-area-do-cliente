import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../common.dto';
// import { QuoteStatus } from '../../entities/quote.entity';

export class FilterQuotesDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'ID do perfil do cliente para filtrar',
    example: 'uuid-do-cliente',
  })
  // @IsOptional()
  // @IsString()
  // profileId?: string;

  // @ApiPropertyOptional({
  //   description: 'Status do orçamento',
  //   enum: QuoteStatus,
  //   example: QuoteStatus.PENDING,
  // })
  // @IsOptional()
  // @IsEnum(QuoteStatus)
  // status?: QuoteStatus;

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
    description: 'Valor mínimo do orçamento',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  minTotal?: number;

  @ApiPropertyOptional({
    description: 'Valor máximo do orçamento',
    example: 5000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  maxTotal?: number;

  @ApiPropertyOptional({
    description: 'Filtrar apenas orçamentos expirados',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  expired?: boolean;

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
    description: 'Incluir itens do orçamento na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeItems?: boolean = false;
}
