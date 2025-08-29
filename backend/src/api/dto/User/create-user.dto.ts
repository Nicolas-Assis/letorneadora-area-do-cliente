import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsPhoneNumber, IsEnum } from 'class-validator';
// import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '(11) 99999-9999',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa LTDA',
    required: false,
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({
    description: 'cpf',
    example: '123.456.789-09',
    required: false,
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  //   @ApiProperty({
  //     description: 'Role do usuário',
  //     enum: Role,
  //     example: Role.CLIENT,
  //     default: Role.CLIENT,
  //     required: false,
  //   })
  //   @IsOptional()
  //   @IsEnum(Role)
  //   role?: Role = Role.CLIENT;
  // }
}
