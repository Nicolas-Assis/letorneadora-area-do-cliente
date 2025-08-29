import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsArray, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class FilterProductsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Termo de busca (nome ou descrição)',
    example: 'usinagem',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar apenas produtos ativos',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar apenas produtos disponíveis',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  available?: boolean;

  @ApiPropertyOptional({
    description: 'IDs das categorias para filtrar',
    example: [1, 2],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(v => parseInt(v));
    }
    return value ? [parseInt(value)] : undefined;
  })
  categoryIds?: number[];

  @ApiPropertyOptional({
    description: 'Incluir categorias na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeCategories?: boolean = false;

  @ApiPropertyOptional({
    description: 'Incluir imagens na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeImages?: boolean = false;
}

