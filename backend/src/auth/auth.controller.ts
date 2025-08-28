import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Fazer login no sistema',
    description: 'Autentica um usuário e retorna um token de acesso JWT'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso',
    type: LoginResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Credenciais inválidas' },
        timestamp: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Dados de entrada inválidos' },
        errors: { type: 'array', items: { type: 'string' } },
        timestamp: { type: 'string' }
      }
    }
  })
  async login(@Body() loginDto: LoginDto): Promise<BaseResponseDto<LoginResponseDto>> {
    const result = await this.authService.login(loginDto);
    return BaseResponseDto.success('Login realizado com sucesso', result);
  }

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário no sistema'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso',
    type: RegisterResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email já está em uso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Email já está em uso' },
        timestamp: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Dados de entrada inválidos' },
        errors: { type: 'array', items: { type: 'string' } },
        timestamp: { type: 'string' }
      }
    }
  })
  async register(@Body() registerDto: RegisterDto): Promise<BaseResponseDto<RegisterResponseDto>> {
    const result = await this.authService.register(registerDto);
    return BaseResponseDto.success('Usuário criado com sucesso', result);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Obter estatísticas de autenticação',
    description: 'Retorna estatísticas sobre usuários e logins (apenas para demonstração)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas obtidas com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Estatísticas obtidas com sucesso' },
        data: {
          type: 'object',
          properties: {
            totalUsers: { type: 'number', example: 10 },
            activeUsers: { type: 'number', example: 8 },
            verifiedUsers: { type: 'number', example: 7 },
            customerUsers: { type: 'number', example: 6 },
            adminUsers: { type: 'number', example: 2 },
            recentLogins: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  lastLoginAt: { type: 'string' }
                }
              }
            }
          }
        },
        timestamp: { type: 'string' }
      }
    }
  })
  async getStats(): Promise<BaseResponseDto> {
    const stats = await this.authService.getAuthStats();
    return BaseResponseDto.success('Estatísticas obtidas com sucesso', stats);
  }

  @Post('validate')
  @ApiOperation({ 
    summary: 'Validar token de acesso',
    description: 'Verifica se um token JWT é válido e retorna informações do usuário'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Token válido' },
        data: {
          type: 'object',
          properties: {
            valid: { type: 'boolean', example: true },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        },
        timestamp: { type: 'string' }
      }
    }
  })
  async validateToken(@Body() body: { token: string }): Promise<BaseResponseDto> {
    const user = await this.authService.validateToken(body.token);
    
    if (user) {
      return BaseResponseDto.success('Token válido', {
        valid: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return BaseResponseDto.success('Token inválido', {
        valid: false,
        user: null,
      });
    }
  }
}

