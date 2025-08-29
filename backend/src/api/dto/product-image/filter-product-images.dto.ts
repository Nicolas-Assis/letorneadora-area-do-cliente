import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../common.dto';

export class FilterProductImagesDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'ID do produto para filtrar imagens',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  productId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar apenas imagens principais',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPrimary?: boolean;
}

