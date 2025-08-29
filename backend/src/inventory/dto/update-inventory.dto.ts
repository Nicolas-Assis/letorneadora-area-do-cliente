import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateInventoryDto {
  @ApiProperty({
    description: 'Nova quantidade em estoque',
    example: 150,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  quantity: number;
}

