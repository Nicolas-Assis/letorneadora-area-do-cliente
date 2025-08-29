import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInventoryDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  productId: number;

  @ApiProperty({
    description: 'ID do armazém',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  warehouseId: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  quantity: number;
}

