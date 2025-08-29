import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsEnum, IsBoolean } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.santos@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '(11) 98888-8888',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Nova Empresa LTDA',
    required: false,
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '98.765.432/0001-10',
    required: false,
  })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({
    description: 'Role do usuário',
    enum: Role,
    example: Role.OPERATOR,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    description: 'Se o perfil está ativo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

