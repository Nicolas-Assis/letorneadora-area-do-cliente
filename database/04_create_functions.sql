-- Le Torneadora - Portal do Cliente
-- Script de funções e triggers
-- Execute após os scripts anteriores

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at 
  BEFORE UPDATE ON public.addresses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON public.categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON public.products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at 
  BEFORE UPDATE ON public.carts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON public.cart_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at 
  BEFORE UPDATE ON public.faqs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at 
  BEFORE UPDATE ON public.support_tickets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_config_updated_at 
  BEFORE UPDATE ON public.app_config 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar slug automaticamente
CREATE OR REPLACE FUNCTION generate_slug_from_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    regexp_replace(NEW.name, '[áàâãäå]', 'a', 'gi'),
                    '[éèêë]', 'e', 'gi'
                  ),
                  '[íìîï]', 'i', 'gi'
                ),
                '[óòôõö]', 'o', 'gi'
              ),
              '[úùûü]', 'u', 'gi'
            ),
            '[ç]', 'c', 'gi'
          ),
          '[^a-z0-9\s-]', '', 'gi'
        ),
        '\s+', '-', 'gi'
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para gerar slugs
CREATE TRIGGER generate_category_slug 
  BEFORE INSERT OR UPDATE ON public.categories 
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_name();

CREATE TRIGGER generate_product_slug 
  BEFORE INSERT OR UPDATE ON public.products 
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_name();

-- Função para gerar número do pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  year_suffix TEXT;
  sequence_num INTEGER;
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    -- Obter os dois últimos dígitos do ano
    year_suffix := to_char(NOW(), 'YY');
    
    -- Obter próximo número da sequência para o ano atual
    SELECT COALESCE(MAX(
      CASE 
        WHEN order_number ~ ('^LT' || year_suffix || '[0-9]+$') 
        THEN CAST(substring(order_number from 5) AS INTEGER)
        ELSE 0 
      END
    ), 0) + 1 INTO sequence_num
    FROM public.orders
    WHERE order_number LIKE 'LT' || year_suffix || '%';
    
    -- Gerar número do pedido: LT + ano + sequência com 6 dígitos
    NEW.order_number := 'LT' || year_suffix || lpad(sequence_num::TEXT, 6, '0');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número do pedido
CREATE TRIGGER generate_order_number_trigger 
  BEFORE INSERT ON public.orders 
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Função para gerar número do ticket de suporte
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
  year_suffix TEXT;
  sequence_num INTEGER;
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    -- Obter os dois últimos dígitos do ano
    year_suffix := to_char(NOW(), 'YY');
    
    -- Obter próximo número da sequência para o ano atual
    SELECT COALESCE(MAX(
      CASE 
        WHEN ticket_number ~ ('^SUP' || year_suffix || '[0-9]+$') 
        THEN CAST(substring(ticket_number from 6) AS INTEGER)
        ELSE 0 
      END
    ), 0) + 1 INTO sequence_num
    FROM public.support_tickets
    WHERE ticket_number LIKE 'SUP' || year_suffix || '%';
    
    -- Gerar número do ticket: SUP + ano + sequência com 5 dígitos
    NEW.ticket_number := 'SUP' || year_suffix || lpad(sequence_num::TEXT, 5, '0');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número do ticket
CREATE TRIGGER generate_ticket_number_trigger 
  BEFORE INSERT ON public.support_tickets 
  FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- Função para garantir apenas uma imagem primária por produto
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = TRUE THEN
    -- Remover is_primary de outras imagens do mesmo produto
    UPDATE public.product_images 
    SET is_primary = FALSE 
    WHERE product_id = NEW.product_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para garantir apenas uma imagem primária
CREATE TRIGGER ensure_single_primary_image_trigger 
  BEFORE INSERT OR UPDATE ON public.product_images 
  FOR EACH ROW EXECUTE FUNCTION ensure_single_primary_image();

-- Função para garantir apenas um endereço padrão por usuário e tipo
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    -- Remover is_default de outros endereços do mesmo usuário e tipo
    UPDATE public.addresses 
    SET is_default = FALSE 
    WHERE user_id = NEW.user_id AND type = NEW.type AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para garantir apenas um endereço padrão
CREATE TRIGGER ensure_single_default_address_trigger 
  BEFORE INSERT OR UPDATE ON public.addresses 
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_address();

-- Função para criar usuário automaticamente após registro no auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para calcular totais do carrinho
CREATE OR REPLACE FUNCTION calculate_cart_totals(cart_uuid UUID)
RETURNS TABLE(total_items INTEGER, total_amount DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(ci.quantity), 0)::INTEGER as total_items,
    COALESCE(SUM(ci.quantity * ci.unit_price), 0)::DECIMAL as total_amount
  FROM public.cart_items ci
  WHERE ci.cart_id = cart_uuid;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular totais do pedido
CREATE OR REPLACE FUNCTION calculate_order_totals(order_uuid UUID)
RETURNS TABLE(subtotal DECIMAL, total_amount DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(oi.total_price), 0)::DECIMAL as subtotal,
    COALESCE(SUM(oi.total_price), 0)::DECIMAL as total_amount
  FROM public.order_items oi
  WHERE oi.order_id = order_uuid;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar disponibilidade de estoque
CREATE OR REPLACE FUNCTION check_product_availability(product_uuid UUID, requested_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  SELECT stock_quantity INTO available_stock
  FROM public.products
  WHERE id = product_uuid AND is_active = TRUE;
  
  RETURN COALESCE(available_stock, 0) >= requested_quantity;
END;
$$ LANGUAGE plpgsql;

-- Comentários sobre as funções
COMMENT ON FUNCTION update_updated_at_column() IS 'Atualiza automaticamente o campo updated_at';
COMMENT ON FUNCTION generate_slug_from_name() IS 'Gera slug automaticamente a partir do nome';
COMMENT ON FUNCTION generate_order_number() IS 'Gera número único do pedido no formato LTYY000000';
COMMENT ON FUNCTION generate_ticket_number() IS 'Gera número único do ticket no formato SUPYY00000';
COMMENT ON FUNCTION handle_new_user() IS 'Cria registro na tabela users após registro no auth';
COMMENT ON FUNCTION calculate_cart_totals(UUID) IS 'Calcula totais do carrinho';
COMMENT ON FUNCTION calculate_order_totals(UUID) IS 'Calcula totais do pedido';
COMMENT ON FUNCTION check_product_availability(UUID, INTEGER) IS 'Verifica disponibilidade de estoque do produto';

