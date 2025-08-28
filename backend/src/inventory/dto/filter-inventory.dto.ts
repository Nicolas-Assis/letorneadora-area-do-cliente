import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsInt, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class FilterInventoryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'ID do produto para filtrar',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  productId?: number;

  @ApiPropertyOptional({
    description: 'ID do armazém para filtrar',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  warehouseId?: number;

  @ApiPropertyOptional({
    description: 'Quantidade mínima em estoque',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  minQuantity?: number;

  @ApiPropertyOptional({
    description: 'Quantidade máxima em estoque',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  maxQuantity?: number;

  @ApiPropertyOptional({
    description: 'Filtrar apenas produtos com estoque baixo (abaixo do mínimo)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  lowStock?: boolean;

  @ApiPropertyOptional({
    description: 'Incluir dados do produto na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeProduct?: boolean = false;

  @ApiPropertyOptional({
    description: 'Incluir dados do armazém na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeWarehouse?: boolean = false;
}

