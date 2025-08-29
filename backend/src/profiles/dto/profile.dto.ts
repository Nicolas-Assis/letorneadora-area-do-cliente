import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';

export class ProfileDto {
  @ApiProperty({
    description: 'ID único do perfil',
    example: 'uuid-do-perfil',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '(11) 99999-9999',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa LTDA',
    required: false,
  })
  company?: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90',
    required: false,
  })
  cnpj?: string;

  @ApiProperty({
    description: 'Role do usuário',
    enum: Role,
    example: Role.CLIENT,
  })
  role: Role;

  @ApiProperty({
    description: 'Se o perfil está ativo',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-08-28T19:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-08-28T19:30:00.000Z',
  })
  updatedAt: Date;
}

