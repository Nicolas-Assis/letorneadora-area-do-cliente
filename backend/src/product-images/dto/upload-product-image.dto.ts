import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadProductImageDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  productId: number;

  @ApiProperty({
    description: 'Se esta é a imagem principal do produto',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPrimary?: boolean = false;
}

