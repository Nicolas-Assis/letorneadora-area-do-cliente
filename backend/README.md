# 🔧 Le Torneadora Backend API

## 🚀 Visão Geral

Este é o backend robusto e escalável da **Le Torneadora**, desenvolvido com **NestJS**, **TypeScript**, **Firebase Auth** e **Swagger**. A API foi projetada seguindo as melhores práticas de arquitetura enterprise, oferecendo uma base sólida para o portal do cliente com autenticação moderna e sistema de pagamentos integrado.

## 📋 Índice

- [Características Principais](#características-principais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Instalação e Configuração](#instalação-e-configuração)
- [Autenticação Firebase](#autenticação-firebase)
- [Sistema RBAC](#sistema-rbac)
- [Integração de Pagamentos](#integração-de-pagamentos)
- [API Endpoints](#api-endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## ✨ Características Principais

### 🏗️ **Arquitetura Enterprise**
- **Modular**: Organizado em módulos independentes (auth, products, orders, payments)
- **Escalável**: Estrutura preparada para crescimento
- **Manutenível**: Código limpo e bem documentado
- **Testável**: Arquitetura que facilita testes unitários e de integração

### 🔒 **Autenticação Moderna com Firebase**
- **Firebase Admin SDK** para validação de tokens
- **RBAC** (Role-Based Access Control) com 3 níveis: Admin, Operator, Client
- Guards personalizados para proteção de rotas
- Validação automática de tokens ID do Firebase

### 💳 **Sistema de Pagamentos Integrado**
- **Asaas** como gateway de pagamento
- Suporte a PIX, Boleto e Cartão de Crédito
- Webhooks para atualização automática de status
- Checkout seguro com validação de assinatura

### 📚 **Documentação Automática**
- **Swagger UI** integrado em `/api/docs`
- Documentação interativa de todas as rotas
- Exemplos de request/response
- Schemas automáticos dos DTOs

## 🛠️ Tecnologias Utilizadas

### **Core Framework**
- **NestJS** - Framework Node.js enterprise
- **TypeScript** - Tipagem estática
- **Express** - Servidor HTTP

### **Autenticação & Autorização**
- **Firebase Admin SDK** - Autenticação moderna
- **Custom Guards** - Proteção de rotas
- **RBAC** - Controle de acesso baseado em roles

### **Pagamentos**
- **Asaas API** - Gateway de pagamento brasileiro
- **Axios** - Cliente HTTP para integração
- **Crypto** - Validação de webhooks

### **Database & ORM**
- **TypeORM** - ORM robusto
- **PostgreSQL** - Banco de dados principal
- **Supabase** - Backend-as-a-Service

### **Documentação & Validação**
- **Swagger/OpenAPI** - Documentação automática
- **Class-validator** - Validação de dados
- **Class-transformer** - Transformação de objetos

## 🏛️ Arquitetura

```
src/
├── api/
│   ├── auth/
│   │   ├── guards/
│   │   │   ├── firebase-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   └── enums/
│   │       └── role.enum.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── orders.controller.ts
│   │   └── payments.controller.ts
│   ├── dto/
│   ├── entities/
│   └── api.module.ts
├── services/
│   ├── auth.service.ts
│   ├── asaas.service.ts
│   ├── products.service.ts
│   └── orders.service.ts
└── main.ts
```

## 🔧 Instalação e Configuração

### **1. Pré-requisitos**
- Node.js 18+
- npm ou yarn
- PostgreSQL
- Conta Firebase
- Conta Asaas (sandbox/produção)

### **2. Instalação**
```bash
# Clonar repositório
git clone <repository-url>
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

### **3. Configuração do Firebase**

1. Acesse o [Console Firebase](https://console.firebase.google.com)
2. Crie um novo projeto ou use existente
3. Vá em "Configurações do projeto" > "Contas de serviço"
4. Gere uma nova chave privada
5. Configure as variáveis no `.env`:

```env
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto-firebase.iam.gserviceaccount.com
```

### **4. Configuração do Asaas**

1. Acesse [Asaas](https://www.asaas.com)
2. Crie uma conta e obtenha sua API Key
3. Configure as variáveis no `.env`:

```env
ASAAS_API_KEY=sua-chave-api-asaas
ASAAS_ENV=sandbox  # ou production
ASAAS_WEBHOOK_SECRET=seu-secret-webhook-asaas
```

### **5. Executar**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 🔐 Autenticação Firebase

### **Fluxo de Autenticação**

1. **Frontend**: Usuário faz login via Firebase Auth
2. **Frontend**: Obtém ID Token do Firebase
3. **Frontend**: Envia token no header `Authorization: Bearer <idToken>`
4. **Backend**: Valida token via Firebase Admin SDK
5. **Backend**: Extrai informações do usuário e role
6. **Backend**: Permite acesso baseado no RBAC

### **Exemplo de Uso**

```typescript
// No frontend (JavaScript)
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();

// Fazer requisição para API
fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  }
});
```

## 👥 Sistema RBAC

### **Roles Disponíveis**

| Role | Descrição | Permissões |
|------|-----------|------------|
| **admin** | Administrador | Gerencia tudo (usuários, produtos, pedidos, pagamentos) |
| **operator** | Operador | Cria/edita/exclui produtos, movimenta estoque, muda status de pedidos |
| **client** | Cliente | Navega produtos, faz compras, consulta seus pedidos |

### **Aplicação de Roles**

```typescript
// Proteger rota apenas para admins
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Delete('products/:id')
async deleteProduct(@Param('id') id: string) {
  // Apenas admins podem deletar produtos
}

// Proteger rota para admins e operadores
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.OPERATOR)
@Post('products')
async createProduct(@Body() productData: CreateProductDto) {
  // Admins e operadores podem criar produtos
}

// Proteger rota para usuários autenticados
@UseGuards(FirebaseAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  // Qualquer usuário autenticado pode ver seu perfil
}
```

### **Configuração de Roles no Firebase**

```typescript
// Definir role para usuário (apenas admins podem fazer isso)
await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
```

## 💳 Integração de Pagamentos

### **Fluxo de Pagamento**

1. **Cliente**: Cria pedido
2. **Backend**: Gera checkout no Asaas
3. **Asaas**: Retorna dados de pagamento (PIX, boleto, etc.)
4. **Cliente**: Realiza pagamento
5. **Asaas**: Envia webhook para backend
6. **Backend**: Atualiza status do pedido

### **Endpoints de Pagamento**

```typescript
// Criar checkout
POST /api/payments/checkout
{
  "customerName": "João Silva",
  "customerEmail": "joao@email.com",
  "amount": 150.00,
  "description": "Pedido #123",
  "externalReference": "order_123"
}

// Consultar pagamento
GET /api/payments/{paymentId}

// Webhook do Asaas
POST /api/webhooks/asaas
```

### **Exemplo de Checkout**

```typescript
const checkout = await fetch('/api/payments/checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerName: 'João Silva',
    amount: 150.00,
    description: 'Pedido #123',
    externalReference: 'order_123'
  })
});

const result = await checkout.json();
// result.data.pixQrCode - QR Code para pagamento PIX
// result.data.invoiceUrl - URL do boleto
```

## 🛣️ API Endpoints

### **Autenticação**
- `GET /api/auth/profile` - Perfil do usuário autenticado
- `POST /api/auth/validate` - Validar token Firebase
- `GET /api/auth/users` - Listar usuários (Admin)
- `PUT /api/auth/users/:uid/role` - Atualizar role (Admin)
- `POST /api/auth/users` - Criar usuário (Admin)
- `DELETE /api/auth/users/:uid` - Deletar usuário (Admin)

### **Produtos**
- `GET /api/products` - Listar produtos (Público)
- `GET /api/products/:id` - Buscar produto (Público)
- `POST /api/products` - Criar produto (Admin/Operator)
- `PATCH /api/products/:id` - Atualizar produto (Admin/Operator)
- `DELETE /api/products/:id` - Deletar produto (Admin)

### **Pedidos**
- `GET /api/orders` - Listar todos os pedidos (Admin/Operator)
- `GET /api/orders/my-orders` - Meus pedidos (Cliente)
- `GET /api/orders/:id` - Buscar pedido
- `POST /api/orders` - Criar pedido (Autenticado)
- `PATCH /api/orders/:id` - Atualizar pedido (Admin/Operator)
- `PATCH /api/orders/:id/status` - Atualizar status (Admin/Operator)
- `DELETE /api/orders/:id` - Deletar pedido (Admin)

### **Pagamentos**
- `POST /api/payments/checkout` - Criar checkout (Autenticado)
- `GET /api/payments/:id` - Consultar pagamento (Autenticado)
- `POST /api/webhooks/asaas` - Webhook Asaas (Público)

## 🚀 Deploy

### **Variáveis de Ambiente Obrigatórias**

```env
# Servidor
PORT=3001
NODE_ENV=production

# Firebase
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com

# Asaas
ASAAS_API_KEY=sua-chave-api-asaas
ASAAS_ENV=production
ASAAS_WEBHOOK_SECRET=seu-secret-webhook-asaas

# Database
DATABASE_HOST=seu-host-postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua-senha
DATABASE_NAME=letorneadora
```

### **Build e Deploy**

```bash
# Build
npm run build

# Executar em produção
npm run start:prod
```

## 📖 Documentação da API

Acesse a documentação interativa em: `http://localhost:3001/api/docs`

A documentação Swagger inclui:
- Todos os endpoints disponíveis
- Schemas de request/response
- Exemplos de uso
- Informações de autenticação
- Códigos de status HTTP

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Changelog

### v2.0.0 - Refatoração Firebase Auth
- ✅ Removido JWT, implementado Firebase Auth
- ✅ Sistema RBAC com 3 roles (admin/operator/client)
- ✅ Integração inicial com Asaas para pagamentos
- ✅ Guards personalizados para Firebase
- ✅ Endpoints de gerenciamento de usuários
- ✅ Webhooks para atualização de status de pagamento

### v1.0.0 - Versão Inicial
- ✅ Estrutura base com NestJS
- ✅ CRUD de produtos e pedidos
- ✅ Documentação Swagger
- ✅ Validação de dados

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Le Torneadora** - Transformando ideias em realidade através da tecnologia 🔧✨

