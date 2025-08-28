-- Le Torneadora - Portal do Cliente
-- Script de criação das tabelas principais
-- Execute este script no SQL Editor do Supabase

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Função para gerar slugs automaticamente
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[áàâãäå]', 'a', 'gi'),
        '[éèêë]', 'e', 'gi'
      ),
      '[íìîï]', 'i', 'gi'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Tabela de usuários (estende auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  cpf_cnpj TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT,
  trade_name TEXT,
  document_type TEXT CHECK (document_type IN ('CPF', 'CNPJ')),
  document_number TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela de endereços
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('billing', 'shipping')) NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  cost_price DECIMAL(10,2) CHECK (cost_price >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  min_stock INTEGER DEFAULT 0 CHECK (min_stock >= 0),
  weight DECIMAL(8,3) CHECK (weight >= 0),
  length DECIMAL(8,2) CHECK (length >= 0),
  width DECIMAL(8,2) CHECK (width >= 0),
  height DECIMAL(8,2) CHECK (height >= 0),
  dimension_unit TEXT DEFAULT 'cm' CHECK (dimension_unit IN ('cm', 'm')),
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imagens de produtos
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de especificações de produtos
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de carrinho
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT cart_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Tabela de itens do carrinho
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- Tabela de pedidos/orçamentos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_document TEXT,
  type TEXT CHECK (type IN ('quote', 'order')) DEFAULT 'quote',
  status TEXT CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  notes TEXT,
  internal_notes TEXT,
  quote_valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  product_name TEXT NOT NULL, -- Snapshot do nome do produto
  product_sku TEXT NOT NULL,   -- Snapshot do SKU do produto
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de endereços do pedido (snapshot)
CREATE TABLE IF NOT EXISTS public.order_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('billing', 'shipping')) NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tickets de suporte
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  category TEXT NOT NULL,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações da aplicação
CREATE TABLE IF NOT EXISTS public.app_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários nas tabelas
COMMENT ON TABLE public.users IS 'Usuários do sistema (clientes)';
COMMENT ON TABLE public.user_profiles IS 'Perfis detalhados dos usuários';
COMMENT ON TABLE public.addresses IS 'Endereços dos usuários';
COMMENT ON TABLE public.categories IS 'Categorias de produtos';
COMMENT ON TABLE public.products IS 'Produtos do catálogo';
COMMENT ON TABLE public.product_images IS 'Imagens dos produtos';
COMMENT ON TABLE public.product_specifications IS 'Especificações técnicas dos produtos';
COMMENT ON TABLE public.carts IS 'Carrinhos de compras';
COMMENT ON TABLE public.cart_items IS 'Itens dos carrinhos';
COMMENT ON TABLE public.orders IS 'Pedidos e orçamentos';
COMMENT ON TABLE public.order_items IS 'Itens dos pedidos';
COMMENT ON TABLE public.order_addresses IS 'Endereços dos pedidos (snapshot)';
COMMENT ON TABLE public.faqs IS 'Perguntas frequentes';
COMMENT ON TABLE public.support_tickets IS 'Tickets de suporte';
COMMENT ON TABLE public.app_config IS 'Configurações da aplicação';

