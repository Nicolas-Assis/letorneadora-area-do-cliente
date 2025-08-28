import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
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
    example: 'minhasenha123',
    minLength: 6,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'Tempo de expiração em segundos',
    example: 3600,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

