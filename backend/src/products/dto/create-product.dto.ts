import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Peça Usinada em Alumínio',
    minLength: 2,
    maxLength: 200,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(200, { message: 'Nome deve ter no máximo 200 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada do produto',
    example: 'Peça usinada em alumínio 6061 com acabamento anodizado, ideal para aplicações automotivas.',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MinLength(10, { message: 'Descrição deve ter pelo menos 10 caracteres' })
  @MaxLength(2000, { message: 'Descrição deve ter no máximo 2000 caracteres' })
  description: string;

  @ApiProperty({
    description: 'ID da categoria do produto',
    example: 'cat_123',
  })
  @IsString({ message: 'ID da categoria deve ser uma string' })
  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Preço base do produto (para referência)',
    example: 150.50,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço deve ser maior ou igual a zero' })
  price?: number;

  @ApiPropertyOptional({
    description: 'URL da imagem principal do produto',
    example: 'https://example.com/images/produto.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL da imagem deve ser válida' })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'URLs de imagens adicionais',
    example: ['https://example.com/images/produto2.jpg', 'https://example.com/images/produto3.jpg'],
  })
  @IsOptional()
  @IsArray({ message: 'Imagens adicionais deve ser um array' })
  @IsUrl({}, { each: true, message: 'Cada URL de imagem deve ser válida' })
  additionalImages?: string[];

  @ApiPropertyOptional({
    description: 'Especificações técnicas do produto',
    example: {
      material: 'Alumínio 6061',
      acabamento: 'Anodizado',
      tolerancia: '±0.1mm',
      peso: '250g'
    },
  })
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Tags para facilitar a busca',
    example: ['usinagem', 'aluminio', 'automotivo', 'precisao'],
  })
  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Indica se o produto está ativo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status ativo deve ser um boolean' })
  active?: boolean = true;

  @ApiPropertyOptional({
    description: 'Indica se o produto está em destaque',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Destaque deve ser um boolean' })
  featured?: boolean = false;

  @ApiPropertyOptional({
    description: 'Tempo estimado de produção em dias',
    example: 7,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Tempo de produção deve ser um número' })
  @Min(1, { message: 'Tempo de produção deve ser pelo menos 1 dia' })
  productionTime?: number;
}

