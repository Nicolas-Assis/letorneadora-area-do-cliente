import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Usinagem',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Slug único da categoria (será gerado automaticamente se não fornecido)',
    example: 'usinagem',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'ID da categoria pai (para criar subcategorias)',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  parentId?: number;
}

