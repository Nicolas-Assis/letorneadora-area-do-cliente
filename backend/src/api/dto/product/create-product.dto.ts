import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  active?: boolean = true;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  available?: boolean = true;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Type(() => Number)
  minStock?: number;

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayNotEmpty()
  categoryIds?: number[];
}
