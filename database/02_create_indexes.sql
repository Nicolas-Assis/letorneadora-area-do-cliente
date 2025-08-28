-- Le Torneadora - Portal do Cliente
-- Script de criação de índices para otimização de performance
-- Execute após o script de criação das tabelas

-- Índices para tabela users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_cpf_cnpj ON public.users(cpf_cnpj) WHERE cpf_cnpj IS NOT NULL;

-- Índices para tabela user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_document ON public.user_profiles(document_number) WHERE document_number IS NOT NULL;

-- Índices para tabela addresses
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_type ON public.addresses(type);
CREATE INDEX IF NOT EXISTS idx_addresses_default ON public.addresses(user_id, is_default) WHERE is_default = TRUE;

-- Índices para tabela categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

-- Índices para tabela products
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Índice para busca textual em produtos
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products 
USING gin((name || ' ' || description || ' ' || sku) gin_trgm_ops) 
WHERE is_active = TRUE;

-- Índices compostos para produtos
CREATE INDEX IF NOT EXISTS idx_products_category_active ON public.products(category_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_featured_active ON public.products(is_featured, is_active) WHERE is_active = TRUE AND is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_price_active ON public.products(price, is_active) WHERE is_active = TRUE;

-- Índices para tabela product_images
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON public.product_images(product_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS idx_product_images_sort ON public.product_images(product_id, sort_order);

-- Índices para tabela product_specifications
CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id ON public.product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specifications_sort ON public.product_specifications(product_id, sort_order);

-- Índices para tabela carts
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON public.carts(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_carts_updated_at ON public.carts(updated_at);

-- Índices para tabela cart_items
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- Índices para tabela orders
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_type ON public.orders(type);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_valid_until ON public.orders(quote_valid_until) WHERE quote_valid_until IS NOT NULL;

-- Índices compostos para orders
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_type_status ON public.orders(type, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(status, created_at);

-- Índices para tabela order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Índices para tabela order_addresses
CREATE INDEX IF NOT EXISTS idx_order_addresses_order_id ON public.order_addresses(order_id);
CREATE INDEX IF NOT EXISTS idx_order_addresses_type ON public.order_addresses(order_id, type);

-- Índices para tabela faqs
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_faqs_sort ON public.faqs(category, sort_order) WHERE is_active = TRUE;

-- Índice para busca textual em FAQs
CREATE INDEX IF NOT EXISTS idx_faqs_search ON public.faqs 
USING gin((question || ' ' || answer) gin_trgm_ops) 
WHERE is_active = TRUE;

-- Índices para tabela support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_number ON public.support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_support_tickets_email ON public.support_tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON public.support_tickets(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON public.support_tickets(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at);

-- Índices compostos para support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_status_priority ON public.support_tickets(status, priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status ON public.support_tickets(user_id, status) WHERE user_id IS NOT NULL;

-- Índices para tabela app_config
CREATE INDEX IF NOT EXISTS idx_app_config_key ON public.app_config(key);

-- Comentários sobre os índices
COMMENT ON INDEX idx_products_search IS 'Índice GIN para busca textual em produtos usando trigrams';
COMMENT ON INDEX idx_faqs_search IS 'Índice GIN para busca textual em FAQs usando trigrams';
COMMENT ON INDEX idx_products_category_active IS 'Índice composto para filtrar produtos por categoria e status ativo';
COMMENT ON INDEX idx_orders_user_status IS 'Índice composto para consultas de pedidos por usuário e status';

