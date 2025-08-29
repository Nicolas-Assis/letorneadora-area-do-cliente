import { Expose, Type } from 'class-transformer';

export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  slug: string;

  @Expose()
  active: boolean;

  @Expose()
  available: boolean;

  @Expose()
  minStock?: number;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  // optional: include related ids
  @Expose()
  categoryIds?: number[];
}
