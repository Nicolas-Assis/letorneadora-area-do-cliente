import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { User, UserRole } from '../common/entities/user.entity';

@Injectable()
export class AuthService {
  // Simulação de banco de dados em memória
  private users: User[] = [
    new User({
      id: 'user_1',
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '(11) 99999-9999',
      company: 'Empresa LTDA',
      cnpj: '12.345.678/0001-90',
      role: UserRole.CUSTOMER,
      active: true,
      emailVerified: true,
      createdAt: new Date('2024-01-15T10:30:00.000Z'),
      updatedAt: new Date('2024-01-20T15:45:00.000Z'),
      lastLoginAt: new Date('2024-01-25T09:15:00.000Z'),
    }),
    new User({
      id: 'user_2',
      name: 'Maria Santos',
      email: 'maria@letorneadora.com.br',
      phone: '(11) 98888-8888',
      role: UserRole.ADMIN,
      active: true,
      emailVerified: true,
      createdAt: new Date('2024-01-10T08:00:00.000Z'),
      updatedAt: new Date('2024-01-25T10:30:00.000Z'),
      lastLoginAt: new Date('2024-01-25T08:00:00.000Z'),
    }),
    new User({
      id: 'user_3',
      name: 'Carlos Oliveira',
      email: 'carlos@empresa.com',
      phone: '(11) 97777-7777',
      company: 'Indústria ABC',
      role: UserRole.CUSTOMER,
      active: true,
      emailVerified: true,
      createdAt: new Date('2024-01-20T14:20:00.000Z'),
      updatedAt: new Date('2024-01-24T16:10:00.000Z'),
    }),
  ];

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuário por email
    const user = this.users.find(u => u.email === email && u.active);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Em um sistema real, verificaríamos o hash da senha
    // Por enquanto, aceitar qualquer senha para demonstração
    if (password.length < 6) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Atualizar último login
    user.lastLoginAt = new Date();

    // Gerar token mockado (em produção usaria JWT real)
    const accessToken = this.generateMockToken(user);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hora
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { email, name, password, phone, company, cnpj } = registerDto;

    // Verificar se email já existe
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Criar novo usuário
    const newUser = new User({
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      company,
      cnpj,
      role: UserRole.CUSTOMER,
      active: true,
      emailVerified: false, // Em produção, seria false até verificação
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Adicionar à lista de usuários
    this.users.push(newUser);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        company: newUser.company,
        cnpj: newUser.cnpj,
      },
      message: 'Usuário criado com sucesso. Verifique seu email para ativar a conta.',
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      // Em um sistema real, validaríamos o JWT
      // Por enquanto, extrair ID do token mockado
      const payload = this.decodeMockToken(token);
      const user = this.users.find(u => u.id === payload.userId && u.active);
      return user || null;
    } catch {
      return null;
    }
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id && u.active) || null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email && u.active) || null;
  }

  private generateMockToken(user: User): string {
    // Token mockado para demonstração
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hora
    };

    // Em produção, usaria jwt.sign()
    return `mock_token_${Buffer.from(JSON.stringify(payload)).toString('base64')}`;
  }

  private decodeMockToken(token: string): any {
    // Decodificar token mockado
    const base64Payload = token.replace('mock_token_', '');
    return JSON.parse(Buffer.from(base64Payload, 'base64').toString());
  }

  // Método para obter estatísticas (útil para dashboard)
  async getAuthStats() {
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(u => u.active).length;
    const verifiedUsers = this.users.filter(u => u.emailVerified).length;
    const customerUsers = this.users.filter(u => u.role === UserRole.CUSTOMER).length;
    const adminUsers = this.users.filter(u => u.role === UserRole.ADMIN).length;

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      customerUsers,
      adminUsers,
      recentLogins: this.users
        .filter(u => u.lastLoginAt)
        .sort((a, b) => b.lastLoginAt!.getTime() - a.lastLoginAt!.getTime())
        .slice(0, 5)
        .map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          lastLoginAt: u.lastLoginAt,
        })),
    };
  }
}

