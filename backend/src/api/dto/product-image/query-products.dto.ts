import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../common.dto';

export class QueryProductsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por categoria',
    example: 'cat_123',
  })
  @IsOptional()
  @IsString({ message: 'ID da categoria deve ser uma string' })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar apenas produtos ativos',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Ativo deve ser um boolean' })
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar apenas produtos em destaque',
    example: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Destaque deve ser um boolean' })
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Preço mínimo para filtro',
    example: 50,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Preço mínimo deve ser um número' })
  @Min(0, { message: 'Preço mínimo deve ser maior ou igual a zero' })
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Preço máximo para filtro',
    example: 500,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Preço máximo deve ser um número' })
  @Min(0, { message: 'Preço máximo deve ser maior ou igual a zero' })
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por tags (separadas por vírgula)',
    example: 'usinagem,aluminio',
  })
  @IsOptional()
  @IsString({ message: 'Tags deve ser uma string' })
  tags?: string;

  @ApiPropertyOptional({
    description: 'Tempo máximo de produção em dias',
    example: 15,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Tempo máximo de produção deve ser um número' })
  @Min(1, { message: 'Tempo máximo de produção deve ser pelo menos 1 dia' })
  maxProductionTime?: number;

  sort?: string;
  sortOrder?: 'asc' | 'desc';
}
