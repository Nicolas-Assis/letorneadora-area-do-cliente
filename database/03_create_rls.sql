-- Le Torneadora - Portal do Cliente
-- Script de configuração do Row Level Security (RLS)
-- Execute após os scripts de tabelas e índices

-- Habilitar RLS nas tabelas que precisam de controle de acesso

-- Tabela users - usuários só podem ver/editar seus próprios dados
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Tabela user_profiles - usuários só podem ver/editar seu próprio perfil
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile details" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile details" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile details" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Tabela addresses - usuários só podem ver/editar seus próprios endereços
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Tabela categories - leitura pública para categorias ativas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

-- Tabela products - leitura pública para produtos ativos
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Tabela product_images - leitura pública
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_images.product_id 
      AND products.is_active = true
    )
  );

-- Tabela product_specifications - leitura pública
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product specifications" ON public.product_specifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_specifications.product_id 
      AND products.is_active = true
    )
  );

-- Tabela carts - usuários só podem ver/editar seus próprios carrinhos
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own carts" ON public.carts
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can insert own carts" ON public.carts
  FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can update own carts" ON public.carts
  FOR UPDATE USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can delete own carts" ON public.carts
  FOR DELETE USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- Tabela cart_items - usuários só podem ver/editar itens de seus próprios carrinhos
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items" ON public.cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE carts.id = cart_items.cart_id 
      AND (
        (auth.uid() IS NOT NULL AND auth.uid() = carts.user_id) OR
        (auth.uid() IS NULL AND carts.session_id IS NOT NULL)
      )
    )
  );

CREATE POLICY "Users can insert own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE carts.id = cart_items.cart_id 
      AND (
        (auth.uid() IS NOT NULL AND auth.uid() = carts.user_id) OR
        (auth.uid() IS NULL AND carts.session_id IS NOT NULL)
      )
    )
  );

CREATE POLICY "Users can update own cart items" ON public.cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE carts.id = cart_items.cart_id 
      AND (
        (auth.uid() IS NOT NULL AND auth.uid() = carts.user_id) OR
        (auth.uid() IS NULL AND carts.session_id IS NOT NULL)
      )
    )
  );

CREATE POLICY "Users can delete own cart items" ON public.cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE carts.id = cart_items.cart_id 
      AND (
        (auth.uid() IS NOT NULL AND auth.uid() = carts.user_id) OR
        (auth.uid() IS NULL AND carts.session_id IS NOT NULL)
      )
    )
  );

-- Tabela orders - usuários só podem ver seus próprios pedidos
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND user_id IS NULL)
  );

CREATE POLICY "Anyone can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Tabela order_items - usuários só podem ver itens de seus próprios pedidos
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (auth.uid() = orders.user_id OR (auth.uid() IS NULL AND orders.user_id IS NULL))
    )
  );

CREATE POLICY "Anyone can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Tabela order_addresses - usuários só podem ver endereços de seus próprios pedidos
ALTER TABLE public.order_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order addresses" ON public.order_addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_addresses.order_id 
      AND (auth.uid() = orders.user_id OR (auth.uid() IS NULL AND orders.user_id IS NULL))
    )
  );

CREATE POLICY "Anyone can insert order addresses" ON public.order_addresses
  FOR INSERT WITH CHECK (true);

-- Tabela faqs - leitura pública para FAQs ativos
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active faqs" ON public.faqs
  FOR SELECT USING (is_active = true);

-- Tabela support_tickets - usuários só podem ver seus próprios tickets
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own support tickets" ON public.support_tickets
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND user_id IS NULL)
  );

CREATE POLICY "Anyone can insert support tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (true);

-- Tabela app_config - leitura pública para configurações não sensíveis
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public config" ON public.app_config
  FOR SELECT USING (
    key NOT LIKE '%secret%' AND 
    key NOT LIKE '%password%' AND 
    key NOT LIKE '%token%' AND
    key NOT LIKE '%key%'
  );

-- Comentários sobre as políticas RLS
COMMENT ON POLICY "Users can view own profile" ON public.users IS 'Usuários podem visualizar apenas seu próprio perfil';
COMMENT ON POLICY "Anyone can view active products" ON public.products IS 'Qualquer pessoa pode visualizar produtos ativos';
COMMENT ON POLICY "Users can view own carts" ON public.carts IS 'Usuários podem visualizar apenas seus próprios carrinhos';
COMMENT ON POLICY "Users can view own orders" ON public.orders IS 'Usuários podem visualizar apenas seus próprios pedidos';

