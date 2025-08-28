import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
    minLength: 6,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiPropertyOptional({
    description: 'Telefone do usuário',
    example: '(11) 99999-9999',
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (11) 99999-9999',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Nome da empresa',
    example: 'Empresa LTDA',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Nome da empresa deve ser uma string' })
  @MaxLength(100, { message: 'Nome da empresa deve ter no máximo 100 caracteres' })
  company?: string;

  @ApiPropertyOptional({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90',
  })
  @IsOptional()
  @IsString({ message: 'CNPJ deve ser uma string' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ deve estar no formato 12.345.678/0001-90',
  })
  cnpj?: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Dados do usuário criado',
  })
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    company?: string;
    cnpj?: string;
  };

  @ApiProperty({
    description: 'Mensagem de confirmação',
    example: 'Usuário criado com sucesso. Verifique seu email para ativar a conta.',
  })
  message: string;
}

