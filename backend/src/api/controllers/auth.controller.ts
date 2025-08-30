import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards,
  Request,
  Param,
  Put,
  Delete
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../services/auth.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter perfil do usuário autenticado',
    description: 'Retorna informações do usuário autenticado via Firebase',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtido com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Perfil obtido com sucesso' },
        data: {
          type: 'object',
          properties: {
            uid: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            email_verified: { type: 'boolean' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  async getProfile(@Request() req) {
    return {
      success: true,
      message: 'Perfil obtido com sucesso',
      data: {
        uid: req.user.uid,
        email: req.user.email,
        role: req.user.role,
        email_verified: req.user.email_verified,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('validate')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validar token Firebase',
    description: 'Verifica se um token Firebase é válido e retorna informações do usuário',
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
                uid: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                email_verified: { type: 'boolean' },
              },
            },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  async validate(@Request() req) {
    return {
      success: true,
      message: 'Token válido',
      data: {
        valid: true,
        user: {
          uid: req.user.uid,
          email: req.user.email,
          role: req.user.role,
          email_verified: req.user.email_verified,
        },
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Endpoints administrativos - apenas para admins
  @Get('users')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar usuários (Admin)',
    description: 'Lista todos os usuários do sistema - apenas para administradores',
  })
  async listUsers() {
    const users = await this.authService.listUsers();
    return {
      success: true,
      message: 'Usuários listados com sucesso',
      data: users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        customClaims: user.customClaims,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
      })),
      timestamp: new Date().toISOString(),
    };
  }

  @Put('users/:uid/role')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar role do usuário (Admin)',
    description: 'Atualiza o role de um usuário - apenas para administradores',
  })
  async updateUserRole(
    @Param('uid') uid: string,
    @Body('role') role: string,
  ) {
    // Validar se o role é válido
    if (!Object.values(Role).includes(role as Role)) {
      return {
        success: false,
        message: 'Role inválido. Valores permitidos: admin, operator, client',
        timestamp: new Date().toISOString(),
      };
    }

    await this.authService.updateUserRole(uid, role);
    
    return {
      success: true,
      message: 'Role do usuário atualizado com sucesso',
      data: { uid, role },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('users')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar usuário (Admin)',
    description: 'Cria um novo usuário no sistema - apenas para administradores',
  })
  async createUser(@Body() userData: {
    email: string;
    password?: string;
    displayName?: string;
    role?: string;
  }) {
    const user = await this.authService.createUser(userData);
    
    return {
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: userData.role || 'client',
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Delete('users/:uid')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletar usuário (Admin)',
    description: 'Remove um usuário do sistema - apenas para administradores',
  })
  async deleteUser(@Param('uid') uid: string) {
    await this.authService.deleteUser(uid);
    
    return {
      success: true,
      message: 'Usuário deletado com sucesso',
      data: { uid },
      timestamp: new Date().toISOString(),
    };
  }
}

