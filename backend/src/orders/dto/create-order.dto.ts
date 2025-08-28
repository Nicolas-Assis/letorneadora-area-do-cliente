import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsEmail,
  ValidateNested,
  ArrayMinSize,
  Min,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 'prod_123',
  })
  @IsString({ message: 'ID do produto deve ser uma string' })
  @IsNotEmpty({ message: 'ID do produto é obrigatório' })
  productId: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(1, { message: 'Quantidade deve ser pelo menos 1' })
  quantity: number;

  @ApiPropertyOptional({
    description: 'Especificações especiais para este item',
    example: 'Acabamento especial em cromado',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Especificações devem ser uma string' })
  @MaxLength(500, { message: 'Especificações devem ter no máximo 500 caracteres' })
  specifications?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  customerName: string;

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  customerEmail: string;

  @ApiProperty({
    description: 'Telefone do cliente',
    example: '(11) 99999-9999',
  })
  @IsString({ message: 'Telefone deve ser uma string' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (11) 99999-9999',
  })
  customerPhone: string;

  @ApiPropertyOptional({
    description: 'Nome da empresa do cliente',
    example: 'Empresa LTDA',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Nome da empresa deve ser uma string' })
  @MaxLength(100, { message: 'Nome da empresa deve ter no máximo 100 caracteres' })
  customerCompany?: string;

  @ApiPropertyOptional({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90',
  })
  @IsOptional()
  @IsString({ message: 'CNPJ deve ser uma string' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ deve estar no formato 12.345.678/0001-90',
  })
  customerCnpj?: string;

  @ApiProperty({
    description: 'Lista de itens do pedido',
    type: [OrderItemDto],
  })
  @IsArray({ message: 'Itens deve ser um array' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos 1 item no pedido' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Descrição detalhada do projeto',
    example: 'Preciso de peças usinadas para projeto automotivo. Tolerância crítica de ±0.05mm.',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MinLength(10, { message: 'Descrição deve ter pelo menos 10 caracteres' })
  @MaxLength(2000, { message: 'Descrição deve ter no máximo 2000 caracteres' })
  description: string;

  @ApiPropertyOptional({
    description: 'Prazo desejado para entrega (em dias)',
    example: 15,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Prazo desejado deve ser um número' })
  @Min(1, { message: 'Prazo desejado deve ser pelo menos 1 dia' })
  desiredDeadline?: number;

  @ApiPropertyOptional({
    description: 'Observações adicionais',
    example: 'Projeto urgente, favor priorizar.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  @MaxLength(1000, { message: 'Observações devem ter no máximo 1000 caracteres' })
  notes?: string;
}

