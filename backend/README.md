# Le Torneadora - Backend NestJS

## 🚀 Visão Geral

Este é o backend robusto e escalável da **Le Torneadora**, desenvolvido com **NestJS**, **TypeScript** e **Swagger**. A API foi projetada seguindo as melhores práticas de arquitetura enterprise, oferecendo uma base sólida para o portal do cliente e futuras expansões.

## 📋 Índice

- [Características Principais](#características-principais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Instalação e Configuração](#instalação-e-configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Autenticação](#autenticação)
- [Validação e DTOs](#validação-e-dtos)
- [Tratamento de Erros](#tratamento-de-erros)
- [Logging](#logging)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## ✨ Características Principais

### 🏗️ **Arquitetura Enterprise**
- **Modular**: Organizado em módulos independentes (auth, products, orders)
- **Escalável**: Estrutura preparada para crescimento
- **Manutenível**: Código limpo e bem documentado
- **Testável**: Arquitetura que facilita testes unitários e de integração

### 🔒 **Segurança Robusta**
- Validação automática de dados com `class-validator`
- Filtros de exceção globais
- CORS configurado para frontend
- Estrutura preparada para JWT e autenticação

### 📚 **Documentação Automática**
- **Swagger UI** integrado em `/api/docs`
- Documentação interativa de todas as rotas
- Exemplos de request/response
- Schemas automáticos dos DTOs

### 🎯 **Performance Otimizada**
- Interceptors para logging e transformação
- Paginação eficiente
- Filtros avançados
- Respostas padronizadas

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **NestJS** | ^10.0.0 | Framework Node.js enterprise |
| **TypeScript** | ^5.1.3 | Linguagem tipada |
| **Swagger** | ^7.1.8 | Documentação automática |
| **class-validator** | ^0.14.0 | Validação de DTOs |
| **class-transformer** | ^0.5.1 | Transformação de dados |
| **rxjs** | ^7.8.1 | Programação reativa |

## 🏛️ Arquitetura

### Estrutura Modular

```
src/
├── auth/                 # Módulo de autenticação
│   ├── dto/             # Data Transfer Objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── products/            # Módulo de produtos
│   ├── dto/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── orders/              # Módulo de pedidos
│   ├── dto/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── common/              # Recursos compartilhados
│   ├── dto/             # DTOs base
│   ├── entities/        # Entidades
│   ├── filters/         # Filtros de exceção
│   └── interceptors/    # Interceptors
├── app.module.ts        # Módulo principal
└── main.ts             # Ponto de entrada
```

### Padrões Implementados

- **Repository Pattern**: Para acesso a dados
- **DTO Pattern**: Para validação e transferência
- **Factory Pattern**: Para criação de entidades
- **Interceptor Pattern**: Para logging e transformação
- **Filter Pattern**: Para tratamento de exceções

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd le-torneadora/backend
```

2. **Instale as dependências**
```bash
# Com npm
npm install

# Com yarn
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# Configurações da aplicação
PORT=3002
NODE_ENV=development

# Configurações do banco (quando implementado)
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Configurações de autenticação
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Configurações de CORS
FRONTEND_URL=http://localhost:5173
```

4. **Execute a aplicação**
```bash
# Desenvolvimento
npm run start:dev
# ou
yarn start:dev

# Produção
npm run start:prod
# ou
yarn start:prod
```

5. **Acesse a documentação**
- API: `http://localhost:3002`
- Swagger: `http://localhost:3002/api/docs`

## 📁 Estrutura do Projeto

### Módulos Principais

#### 🔐 Auth Module
Responsável pela autenticação e autorização de usuários.

**Endpoints:**
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário
- `POST /auth/validate` - Validação de token
- `GET /auth/stats` - Estatísticas de autenticação

#### 🛍️ Products Module
Gerenciamento completo do catálogo de produtos.

**Endpoints:**
- `GET /products` - Listar produtos com filtros
- `POST /products` - Criar novo produto
- `GET /products/:id` - Obter produto específico
- `PATCH /products/:id` - Atualizar produto
- `DELETE /products/:id` - Remover produto
- `GET /products/categories` - Listar categorias
- `GET /products/stats` - Estatísticas de produtos

#### 📋 Orders Module
Sistema de pedidos e orçamentos.

**Endpoints:**
- `GET /orders` - Listar pedidos com filtros
- `POST /orders` - Criar novo pedido/orçamento
- `GET /orders/:id` - Obter pedido específico
- `PATCH /orders/:id/status` - Atualizar status
- `GET /orders/stats` - Estatísticas de pedidos

### DTOs e Validação

#### Exemplo de DTO com Validação

```typescript
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email deve ter formato válido' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiProperty({ description: 'Nome completo', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;
}
```

### Entities

#### Exemplo de Entity

```typescript
export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  specifications: Record<string, any>;
  productionTime: number;
  active: boolean;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔌 API Endpoints

### Autenticação

#### POST /auth/login
Autentica um usuário no sistema.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "user_123",
      "email": "usuario@exemplo.com",
      "fullName": "João Silva"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  },
  "timestamp": "2025-08-28T18:30:00.000Z"
}
```

### Produtos

#### GET /products
Lista produtos com filtros opcionais.

**Query Parameters:**
- `page` (number): Número da página (padrão: 1)
- `limit` (number): Itens por página (padrão: 10)
- `search` (string): Termo de busca
- `categoryId` (string): Filtrar por categoria
- `minPrice` (number): Preço mínimo
- `maxPrice` (number): Preço máximo
- `active` (boolean): Apenas produtos ativos
- `featured` (boolean): Apenas produtos em destaque

**Response:**
```json
{
  "success": true,
  "message": "Produtos encontrados com sucesso",
  "data": [
    {
      "id": "prod_123",
      "name": "Peça Usinada Especial",
      "description": "Peça de alta precisão...",
      "price": 150.00,
      "categoryId": "cat_123",
      "images": ["image1.jpg", "image2.jpg"],
      "productionTime": 5,
      "active": true,
      "featured": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "timestamp": "2025-08-28T18:30:00.000Z"
}
```

### Pedidos

#### POST /orders
Cria um novo pedido/orçamento.

**Request Body:**
```json
{
  "customerName": "João Silva",
  "customerEmail": "joao@exemplo.com",
  "customerPhone": "(11) 99999-9999",
  "customerCompany": "Empresa LTDA",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "specifications": {
        "material": "Aço inox",
        "acabamento": "Polido"
      }
    }
  ],
  "notes": "Observações especiais do pedido"
}
```

## 🔒 Autenticação

### Estratégia JWT (Preparada)

O sistema está preparado para implementar autenticação JWT:

```typescript
// Middleware de autenticação (exemplo)
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }
    
    // Validar token JWT
    // Implementar lógica de validação
    
    return true;
  }
}
```

### Proteção de Rotas

```typescript
@Controller('products')
@UseGuards(JwtAuthGuard) // Proteger todo o controller
export class ProductsController {
  
  @Get()
  @Public() // Rota pública específica
  findAll() {
    // Lógica do endpoint
  }
}
```

## ✅ Validação e DTOs

### Sistema de Validação

O sistema utiliza `class-validator` para validação automática:

```typescript
import { 
  IsString, 
  IsNumber, 
  IsEmail, 
  IsOptional, 
  Min, 
  Max,
  IsArray,
  ValidateNested 
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  name: string;

  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço deve ser positivo' })
  price: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
```

### Transformação Automática

```typescript
import { Transform } from 'class-transformer';

export class QueryProductsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
```

## 🚨 Tratamento de Erros

### Filtro Global de Exceções

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Erro interno do servidor';

    response.status(status).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### Tipos de Erro Padronizados

- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Não autenticado
- **403 Forbidden**: Sem permissão
- **404 Not Found**: Recurso não encontrado
- **422 Unprocessable Entity**: Validação falhou
- **500 Internal Server Error**: Erro interno

## 📊 Logging

### Interceptor de Logging

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    console.log(`[${method}] ${url} - Iniciado`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        console.log(`[${method}] ${url} - Concluído em ${duration}ms`);
      }),
    );
  }
}
```

## 🧪 Testes

### Estrutura de Testes

```bash
src/
├── auth/
│   ├── auth.controller.spec.ts
│   ├── auth.service.spec.ts
│   └── __mocks__/
├── products/
│   ├── products.controller.spec.ts
│   └── products.service.spec.ts
└── test/
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

### Exemplo de Teste Unitário

```typescript
describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated products', async () => {
    const query = new QueryProductsDto();
    const result = await service.findAll(query);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(Array);
    expect(result.pagination).toBeDefined();
  });
});
```

### Comandos de Teste

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🚀 Deploy

### Preparação para Produção

1. **Build da aplicação**
```bash
npm run build
```

2. **Configuração de produção**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=production_database_url
JWT_SECRET=strong_production_secret
```

3. **Otimizações**
- Compressão gzip habilitada
- Rate limiting configurado
- Logs estruturados
- Health checks implementados

### Docker (Opcional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Variáveis de Ambiente Produção

```env
# Aplicação
NODE_ENV=production
PORT=3000

# Banco de dados
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Autenticação
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Logs
LOG_LEVEL=info
```

## 🤝 Contribuição

### Padrões de Código

1. **TypeScript**: Sempre tipado
2. **ESLint**: Configuração padrão NestJS
3. **Prettier**: Formatação automática
4. **Commits**: Conventional Commits

### Workflow de Desenvolvimento

1. Fork do repositório
2. Criar branch feature: `git checkout -b feature/nova-funcionalidade`
3. Commit das mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para branch: `git push origin feature/nova-funcionalidade`
5. Abrir Pull Request

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev      # Servidor com hot reload
npm run start:debug    # Servidor com debug

# Build
npm run build          # Build para produção
npm run start:prod     # Executar build de produção

# Qualidade
npm run lint           # Verificar código
npm run lint:fix       # Corrigir problemas
npm run format         # Formatar código

# Testes
npm run test           # Testes unitários
npm run test:watch     # Testes em watch mode
npm run test:cov       # Coverage
npm run test:e2e       # Testes end-to-end
```

## 📚 Recursos Adicionais

### Documentação Oficial
- [NestJS Documentation](https://docs.nestjs.com/)
- [Swagger/OpenAPI](https://swagger.io/docs/)
- [class-validator](https://github.com/typestack/class-validator)

### Próximos Passos

1. **Integração com Banco Real**
   - Implementar TypeORM ou Prisma
   - Migrations automáticas
   - Seeds de dados

2. **Autenticação Completa**
   - JWT implementation
   - Refresh tokens
   - Role-based access

3. **Monitoramento**
   - Logs estruturados
   - Métricas de performance
   - Health checks avançados

4. **Cache**
   - Redis integration
   - Cache de consultas
   - Invalidação inteligente

---

## 📞 Suporte

Para dúvidas ou suporte:
- **Email**: suporte@letorneadora.com
- **Documentação**: `/api/docs`
- **Issues**: GitHub Issues

---

**Desenvolvido com ❤️ pela equipe Le Torneadora**

