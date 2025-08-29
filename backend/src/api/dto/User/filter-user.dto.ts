import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../common.dto';
// import { Role } from '../../auth/enums/role.enum';

export class FilterUsersDto extends PaginationQueryDto {
  // @ApiPropertyOptional({
  //   description: 'Role do usuário para filtrar',
  //   enum: Role,
  //   example: Role.CLIENT,
  // })
  // @IsOptional()
  // @IsEnum(Role)
  // role?: Role;

  @ApiPropertyOptional({
    description: 'Filtrar apenas usuários ativos',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Termo de busca (nome, email, empresa)',
    example: 'joão',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por empresa',
    example: 'Empresa LTDA',
  })
  @IsOptional()
  @IsString()
  company?: string;
}
