import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  IsArray,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Peça de Usinagem CNC',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada do produto',
    example: 'Peça de alta precisão fabricada em alumínio 6061',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Slug único do produto (será gerado automaticamente se não fornecido)',
    example: 'peca-usinagem-cnc',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Se o produto está ativo no sistema',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean = true;

  @ApiProperty({
    description: 'Se o produto está disponível para venda',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  available?: boolean = true;

  @ApiProperty({
    description: 'Estoque mínimo do produto',
    example: 10,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  minStock?: number;

  @ApiProperty({
    description: 'IDs das categorias do produto',
    example: [1, 2],
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  categoryIds?: number;
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Peça de Usinagem CNC',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada do produto',
    example: 'Peça de alta precisão fabricada em alumínio 6061',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Slug único do produto (será gerado automaticamente se não fornecido)',
    example: 'peca-usinagem-cnc',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Se o produto está ativo no sistema',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean = true;

  @ApiProperty({
    description: 'Se o produto está disponível para venda',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  available?: boolean = true;

  @ApiProperty({
    description: 'Estoque mínimo do produto',
    example: 10,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  minStock?: number;

  @ApiProperty({
    description: 'IDs das categorias do produto',
    example: [1, 2],
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  categoryId?: number;
}
