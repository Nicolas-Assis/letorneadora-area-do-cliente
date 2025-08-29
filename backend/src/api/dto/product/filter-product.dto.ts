import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min, IsNumber, IsBoolean } from 'class-validator';
import { PaginationQueryDto } from '../common.dto';

function toBoolean(value: any) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  return value === 'true' || value === '1' || value === 1;
}

export class FilterProductsDto extends PaginationQueryDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  active?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  available?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minStockGt?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minStockLt?: number;

  @IsString()
  @IsOptional()
  sort?: string; // e.g. 'name' or 'createdAt'

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'ASC';


}
