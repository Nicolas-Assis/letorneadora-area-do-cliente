-- Le Torneadora - Portal do Cliente
-- Script de dados de exemplo para testes
-- Execute após todos os scripts anteriores

-- Inserir configurações da aplicação
INSERT INTO public.app_config (key, value, description) VALUES
('company_info', '{
  "name": "Le Torneadora Ltda",
  "trade_name": "Le Torneadora",
  "document": "12.345.678/0001-90",
  "email": "contato@letorneadora.com.br",
  "phone": "(11) 3456-7890",
  "website": "https://letorneadora.com.br"
}', 'Informações da empresa'),

('company_address', '{
  "street": "Rua das Indústrias",
  "number": "1234",
  "complement": "Galpão 5",
  "neighborhood": "Distrito Industrial",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567"
}', 'Endereço da empresa'),

('social_media', '{
  "facebook": "https://facebook.com/letorneadora",
  "instagram": "https://instagram.com/letorneadora",
  "linkedin": "https://linkedin.com/company/letorneadora",
  "whatsapp": "5511987654321"
}', 'Redes sociais da empresa'),

('site_settings', '{
  "currency": "BRL",
  "timezone": "America/Sao_Paulo",
  "date_format": "DD/MM/YYYY",
  "decimal_places": 2,
  "items_per_page": 12,
  "max_cart_items": 50
}', 'Configurações gerais do site');

-- Inserir categorias de exemplo
INSERT INTO public.categories (id, name, slug, description, is_active, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Peças Torneadas', 'pecas-torneadas', 'Peças produzidas em torno mecânico com alta precisão', true, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Usinagem CNC', 'usinagem-cnc', 'Peças usinadas em centros de usinagem CNC', true, 2),
('550e8400-e29b-41d4-a716-446655440003', 'Ferramentaria', 'ferramentaria', 'Ferramentas e dispositivos especiais', true, 3),
('550e8400-e29b-41d4-a716-446655440004', 'Manutenção Industrial', 'manutencao-industrial', 'Serviços de manutenção e reparo', true, 4);

-- Inserir subcategorias
INSERT INTO public.categories (id, name, slug, description, parent_id, is_active, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'Eixos e Pinos', 'eixos-pinos', 'Eixos, pinos e componentes cilíndricos', '550e8400-e29b-41d4-a716-446655440001', true, 1),
('550e8400-e29b-41d4-a716-446655440012', 'Buchas e Anéis', 'buchas-aneis', 'Buchas, anéis e componentes internos', '550e8400-e29b-41d4-a716-446655440001', true, 2),
('550e8400-e29b-41d4-a716-446655440021', 'Blocos Usinados', 'blocos-usinados', 'Blocos e bases usinadas', '550e8400-e29b-41d4-a716-446655440002', true, 1),
('550e8400-e29b-41d4-a716-446655440022', 'Flanges', 'flanges', 'Flanges e conexões usinadas', '550e8400-e29b-41d4-a716-446655440002', true, 2);

-- Inserir produtos de exemplo
INSERT INTO public.products (id, name, slug, description, short_description, sku, price, cost_price, category_id, is_active, is_featured, stock_quantity, min_stock, weight, length, width, height) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Eixo Torneado Aço 1045 Ø25mm', 'eixo-torneado-aco-1045-25mm', 'Eixo torneado em aço SAE 1045, com acabamento retificado e tolerância h6. Ideal para aplicações que exigem alta precisão dimensional e boa resistência mecânica.', 'Eixo torneado em aço 1045 com precisão h6', 'EIX-1045-25', 45.90, 28.50, '550e8400-e29b-41d4-a716-446655440011', true, true, 25, 5, 0.850, 15.0, 2.5, 2.5),

('660e8400-e29b-41d4-a716-446655440002', 'Bucha Bronze Ø30x40mm', 'bucha-bronze-30x40mm', 'Bucha em bronze SAE 40, com acabamento interno brunido. Excelente para aplicações com movimento rotativo e baixa manutenção.', 'Bucha em bronze com acabamento brunido', 'BCH-BRZ-3040', 32.50, 19.80, '550e8400-e29b-41d4-a716-446655440012', true, true, 18, 3, 0.420, 4.0, 4.0, 3.0),

('660e8400-e29b-41d4-a716-446655440003', 'Bloco Usinado Alumínio 100x80x50mm', 'bloco-usinado-aluminio-100x80x50mm', 'Bloco usinado em alumínio 6061-T6, com furos e rebaixos conforme desenho técnico. Acabamento anodizado natural.', 'Bloco usinado em alumínio 6061-T6', 'BLC-ALU-100', 125.00, 75.00, '550e8400-e29b-41d4-a716-446655440021', true, false, 8, 2, 1.200, 10.0, 8.0, 5.0),

('660e8400-e29b-41d4-a716-446655440004', 'Flange Aço Inox 304 Ø150mm', 'flange-aco-inox-304-150mm', 'Flange em aço inoxidável AISI 304, usinado conforme norma DIN. Acabamento escovado e passivado quimicamente.', 'Flange em aço inox 304 norma DIN', 'FLG-INOX-150', 280.00, 165.00, '550e8400-e29b-41d4-a716-446655440022', true, true, 5, 1, 2.800, 15.0, 15.0, 3.0),

('660e8400-e29b-41d4-a716-446655440005', 'Pino Temperado Ø12x50mm', 'pino-temperado-12x50mm', 'Pino em aço SAE 4140, temperado e revenido HRC 45-50. Retificado com tolerância h6 e acabamento espelhado.', 'Pino temperado com acabamento retificado', 'PIN-TEMP-1250', 18.75, 11.20, '550e8400-e29b-41d4-a716-446655440011', true, false, 35, 10, 0.180, 5.0, 1.2, 1.2),

('660e8400-e29b-41d4-a716-446655440006', 'Anel Vedação Viton Ø45mm', 'anel-vedacao-viton-45mm', 'Anel de vedação em borracha Viton, resistente a altas temperaturas e produtos químicos. Dureza 75 Shore A.', 'Anel de vedação em Viton alta temperatura', 'ANL-VIT-45', 22.90, 14.50, '550e8400-e29b-41d4-a716-446655440012', true, false, 42, 8, 0.025, 4.5, 4.5, 0.5);

-- Inserir imagens dos produtos
INSERT INTO public.product_images (id, product_id, url, alt_text, is_primary, sort_order) VALUES
-- Eixo Torneado
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', 'Eixo torneado em aço 1045', true, 1),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800', 'Detalhe do acabamento do eixo', false, 2),

-- Bucha Bronze
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', 'Bucha em bronze SAE 40', true, 1),

-- Bloco Alumínio
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800', 'Bloco usinado em alumínio', true, 1),

-- Flange Inox
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', 'Flange em aço inoxidável', true, 1),

-- Pino Temperado
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800', 'Pino temperado retificado', true, 1),

-- Anel Viton
('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', 'Anel de vedação Viton', true, 1);

-- Inserir especificações dos produtos
INSERT INTO public.product_specifications (product_id, name, value, sort_order) VALUES
-- Eixo Torneado
('660e8400-e29b-41d4-a716-446655440001', 'Material', 'Aço SAE 1045', 1),
('660e8400-e29b-41d4-a716-446655440001', 'Diâmetro', 'Ø25mm', 2),
('660e8400-e29b-41d4-a716-446655440001', 'Comprimento', '150mm', 3),
('660e8400-e29b-41d4-a716-446655440001', 'Tolerância', 'h6', 4),
('660e8400-e29b-41d4-a716-446655440001', 'Acabamento', 'Retificado', 5),

-- Bucha Bronze
('660e8400-e29b-41d4-a716-446655440002', 'Material', 'Bronze SAE 40', 1),
('660e8400-e29b-41d4-a716-446655440002', 'Diâmetro Interno', 'Ø30mm', 2),
('660e8400-e29b-41d4-a716-446655440002', 'Diâmetro Externo', 'Ø40mm', 3),
('660e8400-e29b-41d4-a716-446655440002', 'Altura', '30mm', 4),
('660e8400-e29b-41d4-a716-446655440002', 'Acabamento', 'Brunido', 5),

-- Bloco Alumínio
('660e8400-e29b-41d4-a716-446655440003', 'Material', 'Alumínio 6061-T6', 1),
('660e8400-e29b-41d4-a716-446655440003', 'Dimensões', '100x80x50mm', 2),
('660e8400-e29b-41d4-a716-446655440003', 'Acabamento', 'Anodizado Natural', 3),
('660e8400-e29b-41d4-a716-446655440003', 'Tolerância', '±0,1mm', 4),

-- Flange Inox
('660e8400-e29b-41d4-a716-446655440004', 'Material', 'Aço Inox AISI 304', 1),
('660e8400-e29b-41d4-a716-446655440004', 'Diâmetro', 'Ø150mm', 2),
('660e8400-e29b-41d4-a716-446655440004', 'Norma', 'DIN 2527', 3),
('660e8400-e29b-41d4-a716-446655440004', 'Acabamento', 'Escovado e Passivado', 4),

-- Pino Temperado
('660e8400-e29b-41d4-a716-446655440005', 'Material', 'Aço SAE 4140', 1),
('660e8400-e29b-41d4-a716-446655440005', 'Diâmetro', 'Ø12mm', 2),
('660e8400-e29b-41d4-a716-446655440005', 'Comprimento', '50mm', 3),
('660e8400-e29b-41d4-a716-446655440005', 'Dureza', 'HRC 45-50', 4),
('660e8400-e29b-41d4-a716-446655440005', 'Tolerância', 'h6', 5),

-- Anel Viton
('660e8400-e29b-41d4-a716-446655440006', 'Material', 'Borracha Viton', 1),
('660e8400-e29b-41d4-a716-446655440006', 'Diâmetro', 'Ø45mm', 2),
('660e8400-e29b-41d4-a716-446655440006', 'Dureza', '75 Shore A', 3),
('660e8400-e29b-41d4-a716-446655440006', 'Temperatura', '-20°C a +200°C', 4);

-- Inserir FAQs
INSERT INTO public.faqs (question, answer, category, is_active, sort_order) VALUES
('Como faço um orçamento?', 'Para solicitar um orçamento, adicione os produtos desejados ao carrinho e clique em "Solicitar Orçamento". Nossa equipe entrará em contato em até 24 horas.', 'Pedidos', true, 1),

('Qual o prazo de entrega?', 'O prazo de entrega varia conforme a complexidade do produto. Peças em estoque são entregues em 2-3 dias úteis. Peças sob encomenda podem levar de 5 a 15 dias úteis.', 'Entrega', true, 2),

('Vocês fazem peças sob medida?', 'Sim! Somos especializados em peças sob medida. Envie seu desenho técnico através do formulário de contato e faremos um orçamento personalizado.', 'Produtos', true, 3),

('Quais materiais vocês trabalham?', 'Trabalhamos com diversos materiais: aços carbono e inox, alumínio, bronze, latão, plásticos técnicos e outros materiais especiais conforme necessidade.', 'Produtos', true, 4),

('Como acompanho meu pedido?', 'Após fazer login em sua conta, acesse "Meus Pedidos" para acompanhar o status em tempo real. Você também receberá atualizações por email.', 'Pedidos', true, 5),

('Vocês emitem nota fiscal?', 'Sim, emitimos nota fiscal para todas as vendas. Para pessoa jurídica, informe os dados da empresa no cadastro.', 'Fiscal', true, 6),

('Qual a garantia dos produtos?', 'Oferecemos garantia de 90 dias contra defeitos de fabricação. A garantia não cobre desgaste natural ou uso inadequado.', 'Garantia', true, 7),

('Como entro em contato?', 'Você pode entrar em contato através do formulário no site, WhatsApp, telefone ou email. Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.', 'Contato', true, 8);

-- Comentários sobre os dados de exemplo
COMMENT ON TABLE public.app_config IS 'Configurações inseridas: informações da empresa, endereço, redes sociais e configurações do site';
COMMENT ON TABLE public.categories IS 'Categorias inseridas: 4 principais e 4 subcategorias para demonstração';
COMMENT ON TABLE public.products IS 'Produtos inseridos: 6 produtos de exemplo com diferentes características';
COMMENT ON TABLE public.faqs IS 'FAQs inseridos: 8 perguntas frequentes organizadas por categoria';

