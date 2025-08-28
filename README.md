# Portal do Cliente - Le Torneadora

## 📋 Visão Geral

O Portal do Cliente da Le Torneadora é uma aplicação web completa desenvolvida para facilitar a interação entre a empresa e seus clientes, oferecendo funcionalidades de e-commerce, catálogo de produtos, sistema de orçamentos e área do cliente personalizada.

### 🎯 Objetivos do Projeto

- **Modernizar a experiência do cliente** com interface intuitiva e responsiva
- **Automatizar processos de orçamento** reduzindo tempo de resposta
- **Centralizar informações** em uma plataforma única e segura
- **Melhorar comunicação** entre empresa e clientes
- **Facilitar acompanhamento** de pedidos e orçamentos

### 🚀 Funcionalidades Principais

#### Portal do Cliente
- **Página Institucional** - Apresentação da empresa, serviços e diferenciais
- **Catálogo de Produtos** - Navegação com filtros, busca e categorização
- **Sistema de Carrinho** - Adição de produtos e solicitação de orçamentos
- **Checkout Inteligente** - Formulário em etapas para orçamentos personalizados
- **Área do Cliente** - Dashboard com pedidos, orçamentos e perfil
- **FAQ Interativo** - Central de ajuda com busca e categorização
- **Sistema de Contato** - Múltiplos canais de comunicação

#### Recursos Técnicos
- **Autenticação Segura** - Login/registro com Supabase Auth
- **Interface Responsiva** - Adaptada para desktop, tablet e mobile
- **Performance Otimizada** - Carregamento rápido e experiência fluida
- **Segurança Avançada** - Validações, sanitização e proteções
- **Integração Completa** - Backend e frontend totalmente integrados

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

#### Frontend
- **React 18** - Biblioteca principal para interface
- **Ant Design** - Componentes UI profissionais
- **React Router** - Navegação e roteamento
- **Zustand** - Gerenciamento de estado global
- **React Query** - Cache e sincronização de dados
- **Tailwind CSS** - Estilização utilitária
- **Vite** - Build tool e desenvolvimento

#### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional

#### Infraestrutura
- **Supabase Auth** - Autenticação e autorização
- **Supabase Storage** - Armazenamento de arquivos
- **Supabase Realtime** - Atualizações em tempo real
- **Row Level Security** - Segurança a nível de linha

### Estrutura de Diretórios

```
le-torneadora/
├── backend/                 # API Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── middleware/      # Middlewares Express
│   │   ├── routes/          # Definição de rotas
│   │   ├── types/           # Tipos TypeScript
│   │   └── config/          # Configurações
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── lib/             # Utilitários e configurações
│   │   ├── tests/           # Testes automatizados
│   │   └── assets/          # Recursos estáticos
│   ├── package.json
│   └── vite.config.js
├── database/                # Scripts SQL e migrations
│   ├── 01_create_tables.sql
│   ├── 02_create_indexes.sql
│   ├── 03_create_rls.sql
│   ├── 04_create_functions.sql
│   ├── 05_sample_data.sql
│   └── 06_setup_storage.sql
├── docs/                    # Documentação adicional
└── README.md               # Este arquivo
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **pnpm**
- **Conta Supabase** (gratuita)
- **Git** para controle de versão

### 1. Configuração do Supabase

#### Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha organização e configure:
   - **Name**: Le Torneadora Portal
   - **Database Password**: Senha segura
   - **Region**: South America (São Paulo)
5. Aguarde criação do projeto (2-3 minutos)

#### Configurar Banco de Dados
1. No painel do Supabase, vá em **SQL Editor**
2. Execute os scripts na seguinte ordem:
   ```bash
   # Copie e execute cada arquivo SQL:
   database/01_create_tables.sql
   database/02_create_indexes.sql
   database/03_create_rls.sql
   database/04_create_functions.sql
   database/05_sample_data.sql
   database/06_setup_storage.sql
   ```

#### Configurar Autenticação
1. Vá em **Authentication > Settings**
2. Configure **Site URL**: `http://localhost:5173`
3. Adicione **Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - `https://seudominio.com/auth/callback` (produção)
4. Habilite **Email confirmations** se desejado

#### Obter Credenciais
1. Vá em **Settings > API**
2. Copie as seguintes informações:
   - **Project URL**
   - **anon public key**
   - **service_role key** (apenas para backend)

### 2. Configuração do Backend

```bash
# Navegar para diretório do backend
cd backend

# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env
```

#### Configurar Variáveis de Ambiente (.env)
```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-publica
SUPABASE_SERVICE_KEY=sua-chave-servico

# Servidor
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT
JWT_SECRET=sua-chave-jwt-secreta
```

#### Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

### 3. Configuração do Frontend

```bash
# Navegar para diretório do frontend
cd frontend

# Instalar dependências
pnpm install

# Criar arquivo de ambiente
cp .env.example .env.local
```

#### Configurar Variáveis de Ambiente (.env.local)
```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica

# API Backend
VITE_API_URL=http://localhost:3001

# Configurações da Aplicação
VITE_APP_NAME=Le Torneadora
VITE_APP_VERSION=1.0.0
```

#### Iniciar Aplicação de Desenvolvimento
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🎨 Guia de Uso

### Para Clientes

#### Navegação Principal
- **Início** - Página institucional com informações da empresa
- **Produtos** - Catálogo completo com filtros e busca
- **Sobre** - História e diferenciais da Le Torneadora
- **Contato** - Informações de contato e localização
- **FAQ** - Perguntas frequentes organizadas por categoria

#### Solicitando Orçamento
1. **Navegue pelo catálogo** de produtos
2. **Adicione itens** ao carrinho com quantidades desejadas
3. **Acesse o carrinho** e revise os produtos
4. **Clique em "Solicitar Orçamento"**
5. **Preencha o formulário** com suas informações:
   - Dados pessoais (nome, email, telefone)
   - Dados da empresa (opcional)
   - Descrição detalhada do projeto
   - Especificações técnicas
   - Prazo desejado
6. **Envie a solicitação** e receba confirmação
7. **Acompanhe o status** na área do cliente

#### Área do Cliente
Após criar conta e fazer login:

**Dashboard**
- Visão geral de pedidos e orçamentos
- Estatísticas pessoais
- Ações rápidas para novas solicitações

**Meus Pedidos**
- Histórico completo de pedidos
- Status em tempo real
- Detalhes de cada pedido

**Meus Orçamentos**
- Orçamentos solicitados
- Status de aprovação
- Valores e prazos

**Meu Perfil**
- Informações pessoais
- Dados da empresa
- Configurações de conta

### Para Administradores

#### Gerenciamento via Supabase
1. **Acesse o painel** do Supabase
2. **Vá em Table Editor** para gerenciar dados
3. **Principais tabelas**:
   - `products` - Catálogo de produtos
   - `categories` - Categorias de produtos
   - `quotes` - Orçamentos solicitados
   - `orders` - Pedidos confirmados
   - `users` - Dados dos clientes

#### Atualizando Produtos
```sql
-- Adicionar novo produto
INSERT INTO products (name, description, category_id, price, image_url, active)
VALUES ('Peça Usinada', 'Descrição detalhada', 1, 150.00, 'url-da-imagem', true);

-- Atualizar preço
UPDATE products SET price = 200.00 WHERE id = 1;

-- Desativar produto
UPDATE products SET active = false WHERE id = 1;
```

#### Gerenciando Orçamentos
```sql
-- Listar orçamentos pendentes
SELECT q.*, u.email, u.name 
FROM quotes q 
JOIN users u ON q.user_id = u.id 
WHERE q.status = 'pending';

-- Aprovar orçamento
UPDATE quotes 
SET status = 'approved', total_amount = 1500.00, approved_at = NOW()
WHERE id = 1;
```

## 🔒 Segurança

### Medidas Implementadas

#### Autenticação
- **JWT Tokens** com expiração automática
- **Refresh Tokens** para sessões longas
- **Rate Limiting** para prevenir ataques de força bruta
- **Validação de email** obrigatória para novos usuários

#### Autorização
- **Row Level Security (RLS)** no Supabase
- **Políticas de acesso** granulares por tabela
- **Middleware de autenticação** em rotas protegidas
- **Verificação de permissões** em cada operação

#### Validação de Dados
- **Sanitização de inputs** para prevenir XSS
- **Validação de tipos** com TypeScript
- **Esquemas de validação** para formulários
- **Escape de HTML** em conteúdo dinâmico

#### Proteções Adicionais
- **CORS configurado** para domínios específicos
- **Headers de segurança** (CSP, HSTS, etc.)
- **Logs de auditoria** para ações críticas
- **Backup automático** do banco de dados

### Boas Práticas de Segurança

#### Para Desenvolvedores
```javascript
// Sempre validar inputs
const { validateEmail, sanitizeInput } = require('./lib/security')

// Usar prepared statements
const result = await supabase
  .from('users')
  .select('*')
  .eq('email', sanitizeInput(email))

// Verificar autenticação
const { user, error } = await supabase.auth.getUser(token)
if (error || !user) {
  return res.status(401).json({ error: 'Não autorizado' })
}
```

#### Para Administradores
- **Senhas fortes** para contas administrativas
- **Acesso limitado** ao painel do Supabase
- **Monitoramento regular** de logs de acesso
- **Backups periódicos** dos dados críticos
- **Atualizações regulares** das dependências

## 🚀 Deploy em Produção

### Opção 1: Vercel (Recomendado para Frontend)

#### Preparação
```bash
# Build de produção
cd frontend
pnpm build

# Testar build localmente
pnpm preview
```

#### Deploy
1. **Conecte repositório** no Vercel
2. **Configure variáveis** de ambiente:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publica
   VITE_API_URL=https://sua-api.herokuapp.com
   ```
3. **Deploy automático** a cada push

### Opção 2: Netlify

#### Build Settings
- **Build command**: `pnpm build`
- **Publish directory**: `dist`
- **Node version**: `18`

#### Configuração
```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Backend Deploy (Heroku)

#### Preparação
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create le-torneadora-api
```

#### Configuração
```bash
# Configurar variáveis
heroku config:set SUPABASE_URL=https://seu-projeto.supabase.co
heroku config:set SUPABASE_ANON_KEY=sua-chave-publica
heroku config:set SUPABASE_SERVICE_KEY=sua-chave-servico
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Configurações de Produção

#### Supabase
1. **Atualizar Site URL** para domínio de produção
2. **Configurar Redirect URLs** de produção
3. **Habilitar SSL** (automático)
4. **Configurar backups** automáticos

#### DNS e SSL
1. **Configurar domínio** personalizado
2. **Certificado SSL** automático
3. **CDN** para assets estáticos
4. **Monitoramento** de uptime

## 📊 Monitoramento e Analytics

### Métricas Importantes

#### Performance
- **Tempo de carregamento** das páginas
- **Core Web Vitals** (LCP, FID, CLS)
- **Taxa de conversão** de orçamentos
- **Abandono de carrinho**

#### Uso
- **Páginas mais visitadas**
- **Produtos mais visualizados**
- **Fluxo de navegação** dos usuários
- **Dispositivos e navegadores**

#### Negócio
- **Orçamentos solicitados** por período
- **Taxa de aprovação** de orçamentos
- **Valor médio** por orçamento
- **Tempo de resposta** da equipe

### Ferramentas Recomendadas

#### Analytics
- **Google Analytics 4** - Análise de comportamento
- **Hotjar** - Mapas de calor e gravações
- **Supabase Analytics** - Métricas de banco de dados

#### Monitoramento
- **Sentry** - Monitoramento de erros
- **Uptime Robot** - Monitoramento de disponibilidade
- **New Relic** - Performance de aplicação

#### Implementação
```javascript
// Google Analytics
import { gtag } from 'ga-gtag'

// Rastrear evento de orçamento
gtag('event', 'quote_requested', {
  event_category: 'engagement',
  event_label: 'product_category',
  value: totalValue
})

// Sentry para erros
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'sua-dsn-do-sentry',
  environment: process.env.NODE_ENV
})
```

## 🧪 Testes

### Testes Automatizados

#### Executar Testes
```bash
# Frontend
cd frontend
pnpm test

# Backend
cd backend
npm test

# Testes de segurança
pnpm test:security
```

#### Tipos de Teste

**Unitários**
- Validação de funções utilitárias
- Componentes React isolados
- Lógica de negócio

**Integração**
- Fluxos completos de usuário
- Integração com Supabase
- APIs e endpoints

**E2E (End-to-End)**
- Jornada completa do cliente
- Processo de orçamento
- Autenticação e autorização

### Testes Manuais

#### Checklist de QA

**Funcionalidade**
- [ ] Navegação entre páginas
- [ ] Busca e filtros de produtos
- [ ] Adição ao carrinho
- [ ] Processo de orçamento
- [ ] Login/registro
- [ ] Área do cliente
- [ ] FAQ e contato

**Responsividade**
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Orientação landscape/portrait

**Navegadores**
- [ ] Chrome (últimas 2 versões)
- [ ] Firefox (últimas 2 versões)
- [ ] Safari (últimas 2 versões)
- [ ] Edge (últimas 2 versões)

**Performance**
- [ ] Tempo de carregamento < 3s
- [ ] Imagens otimizadas
- [ ] Bundle size otimizado
- [ ] Lazy loading funcionando

## 🔧 Manutenção

### Tarefas Regulares

#### Diárias
- **Monitorar logs** de erro
- **Verificar uptime** da aplicação
- **Responder orçamentos** pendentes
- **Backup automático** verificado

#### Semanais
- **Analisar métricas** de uso
- **Revisar performance** da aplicação
- **Atualizar conteúdo** se necessário
- **Verificar segurança** do sistema

#### Mensais
- **Atualizar dependências** (patch versions)
- **Revisar políticas** de segurança
- **Analisar feedback** dos usuários
- **Planejar melhorias** futuras

#### Trimestrais
- **Atualizar dependências** (minor versions)
- **Revisar arquitetura** do sistema
- **Avaliar novas funcionalidades**
- **Auditoria de segurança** completa

### Troubleshooting

#### Problemas Comuns

**Erro de Conexão com Supabase**
```javascript
// Verificar configuração
console.log('Supabase URL:', process.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10) + '...')

// Testar conexão
const { data, error } = await supabase.from('products').select('count')
if (error) console.error('Erro de conexão:', error)
```

**Problemas de Autenticação**
```javascript
// Verificar sessão
const { data: { session } } = await supabase.auth.getSession()
console.log('Sessão ativa:', !!session)

// Renovar token
const { data, error } = await supabase.auth.refreshSession()
if (error) console.error('Erro ao renovar:', error)
```

**Performance Lenta**
```javascript
// Analisar bundle
npm run build -- --analyze

// Verificar queries
console.time('query-products')
const products = await supabase.from('products').select('*')
console.timeEnd('query-products')
```

## 📞 Suporte

### Contatos Técnicos

**Desenvolvedor Principal**
- **Email**: dev@letorneadora.com.br
- **Telefone**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 9h às 18h

**Suporte Técnico**
- **Email**: suporte@letorneadora.com.br
- **WhatsApp**: (11) 98888-8888
- **Disponibilidade**: 24/7 para emergências

### Recursos Adicionais

**Documentação**
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Ant Design](https://ant.design)

**Comunidade**
- [GitHub Issues](https://github.com/le-torneadora/portal)
- [Discord Server](https://discord.gg/letorneadora)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/le-torneadora)

---

## 📄 Licença

Este projeto é propriedade da **Le Torneadora Ltda.** e está protegido por direitos autorais. O uso, modificação ou distribuição sem autorização expressa é proibido.

**© 2024 Le Torneadora - Todos os direitos reservados**

---

*Documentação gerada automaticamente pelo sistema de desenvolvimento da Le Torneadora*

