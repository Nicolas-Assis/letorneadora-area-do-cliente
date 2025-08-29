import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 10,
    description: 'page size',
    type: 'number',
    required: false,
  })
  pageSize: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'page',
    type: 'number',
    required: false,
  })
  page: number;
}

export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'Total de itens', example: 100 })
  total: number;

  @ApiProperty({
    type: () => Object,
    isArray: true,
    description: 'Lista de itens',
  })
  list: T[];
}

export class UpdateResponseDto {
  @ApiProperty({ description: 'Total de itens atualizado', example: 100 })
  total?: number;

  @ApiProperty({ description: 'Operação concluida com exito', example: true })
  success?: boolean;
}
