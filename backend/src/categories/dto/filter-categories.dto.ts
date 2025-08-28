import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class FilterCategoriesDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Termo de busca (nome)',
    example: 'usinagem',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'ID da categoria pai (para buscar subcategorias)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  parentId?: number;

  @ApiPropertyOptional({
    description: 'Buscar apenas categorias raiz (sem pai)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  rootOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Incluir subcategorias na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeChildren?: boolean = false;

  @ApiPropertyOptional({
    description: 'Incluir categoria pai na resposta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeParent?: boolean = false;

  @ApiPropertyOptional({
    description: 'Incluir contagem de produtos',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeProductCount?: boolean = false;
}

