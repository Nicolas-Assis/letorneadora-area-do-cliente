import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsDateString, IsNumber, Min, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateQuoteItemDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  productId: number;

  @ApiProperty({
    description: 'Quantidade solicitada',
    example: 5,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  @Transform(({ value }) => parseFloat(value))
  quantity: number;

  @ApiProperty({
    description: 'Preço unitário (opcional, será calculado se não fornecido)',
    example: 150.50,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  unitPrice?: number;
}

export class CreateQuoteDto {
  @ApiProperty({
    description: 'ID do perfil do cliente',
    example: 'uuid-do-cliente',
  })
  @IsString()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({
    description: 'Observações do orçamento',
    example: 'Orçamento para peças especiais com acabamento premium',
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
    description: 'Itens do orçamento',
    type: [CreateQuoteItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items: CreateQuoteItemDto[];
}

