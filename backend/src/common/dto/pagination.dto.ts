import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min, Max } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número da página (começando em 1)',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'Página deve ser um número positivo' })
  @Min(1, { message: 'Página deve ser no mínimo 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de itens por página',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'Limite deve ser um número positivo' })
  @Min(1, { message: 'Limite deve ser no mínimo 1' })
  @Max(100, { message: 'Limite deve ser no máximo 100' })
  limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export class SearchDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Termo de busca',
    example: 'usinagem',
  })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    example: 'name',
  })
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    enum: ['asc', 'desc'],
    default: 'asc',
    example: 'asc',
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'asc';
}

