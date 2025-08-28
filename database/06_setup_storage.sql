-- Le Torneadora - Portal do Cliente
-- Script de configuração do Supabase Storage
-- Execute no SQL Editor do Supabase após criar o bucket

-- Criar bucket para imagens de produtos (execute via interface do Supabase)
-- Nome do bucket: product-images
-- Público: true
-- Tipos de arquivo permitidos: image/jpeg, image/png, image/webp
-- Tamanho máximo: 5MB

-- Políticas de acesso para o bucket product-images
-- (Execute apenas se o bucket já foi criado via interface)

-- Política para visualização pública das imagens
INSERT INTO storage.policies (id, bucket_id, name, definition, check_definition, command, roles)
VALUES (
  'public-product-images-select',
  'product-images',
  'Anyone can view product images',
  'true',
  'true',
  'SELECT',
  '{authenticated,anon}'
) ON CONFLICT (id) DO NOTHING;

-- Política para upload de imagens (apenas usuários autenticados - para futuro admin)
INSERT INTO storage.policies (id, bucket_id, name, definition, check_definition, command, roles)
VALUES (
  'authenticated-product-images-insert',
  'product-images',
  'Authenticated users can upload product images',
  'auth.role() = ''authenticated''',
  'auth.role() = ''authenticated''',
  'INSERT',
  '{authenticated}'
) ON CONFLICT (id) DO NOTHING;

-- Política para atualização de imagens (apenas usuários autenticados - para futuro admin)
INSERT INTO storage.policies (id, bucket_id, name, definition, check_definition, command, roles)
VALUES (
  'authenticated-product-images-update',
  'product-images',
  'Authenticated users can update product images',
  'auth.role() = ''authenticated''',
  'auth.role() = ''authenticated''',
  'UPDATE',
  '{authenticated}'
) ON CONFLICT (id) DO NOTHING;

-- Política para exclusão de imagens (apenas usuários autenticados - para futuro admin)
INSERT INTO storage.policies (id, bucket_id, name, definition, check_definition, command, roles)
VALUES (
  'authenticated-product-images-delete',
  'product-images',
  'Authenticated users can delete product images',
  'auth.role() = ''authenticated''',
  'auth.role() = ''authenticated''',
  'DELETE',
  '{authenticated}'
) ON CONFLICT (id) DO NOTHING;

-- Função para obter URL pública de imagem
CREATE OR REPLACE FUNCTION public.get_product_image_url(image_path TEXT)
RETURNS TEXT AS $$
DECLARE
  base_url TEXT;
BEGIN
  -- Obter URL base do Supabase (substitua pela sua URL)
  SELECT 'https://your-project.supabase.co/storage/v1/object/public/product-images/' INTO base_url;
  
  RETURN base_url || image_path;
END;
$$ LANGUAGE plpgsql;

-- Função para fazer upload de imagem (para uso futuro no admin)
CREATE OR REPLACE FUNCTION public.upload_product_image(
  product_uuid UUID,
  image_data BYTEA,
  file_name TEXT,
  content_type TEXT DEFAULT 'image/jpeg'
)
RETURNS TEXT AS $$
DECLARE
  file_path TEXT;
  image_id UUID;
BEGIN
  -- Gerar caminho único para o arquivo
  file_path := 'products/' || product_uuid::TEXT || '/' || extract(epoch from now())::TEXT || '-' || file_name;
  
  -- Inserir registro na tabela product_images
  INSERT INTO public.product_images (product_id, url, alt_text, is_primary, sort_order)
  VALUES (
    product_uuid,
    file_path,
    'Imagem do produto',
    false,
    (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM public.product_images WHERE product_id = product_uuid)
  )
  RETURNING id INTO image_id;
  
  RETURN file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View para produtos com URLs completas das imagens
CREATE OR REPLACE VIEW public.products_with_images AS
SELECT 
  p.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', pi.id,
        'url', public.get_product_image_url(pi.url),
        'alt_text', pi.alt_text,
        'is_primary', pi.is_primary,
        'sort_order', pi.sort_order
      ) ORDER BY pi.is_primary DESC, pi.sort_order
    ) FILTER (WHERE pi.id IS NOT NULL),
    '[]'::json
  ) as images
FROM public.products p
LEFT JOIN public.product_images pi ON p.id = pi.product_id
WHERE p.is_active = true
GROUP BY p.id;

-- Comentários sobre o storage
COMMENT ON FUNCTION public.get_product_image_url(TEXT) IS 'Retorna URL pública completa da imagem do produto';
COMMENT ON FUNCTION public.upload_product_image(UUID, BYTEA, TEXT, TEXT) IS 'Faz upload de imagem do produto e registra no banco';
COMMENT ON VIEW public.products_with_images IS 'View que retorna produtos com URLs completas das imagens';

-- Instruções para configuração manual do bucket
/*
INSTRUÇÕES PARA CONFIGURAR O STORAGE:

1. Acesse o painel do Supabase
2. Vá em Storage > Buckets
3. Clique em "New bucket"
4. Configure:
   - Name: product-images
   - Public bucket: ✓ (marcado)
   - File size limit: 5242880 (5MB)
   - Allowed MIME types: image/jpeg,image/png,image/webp

5. Após criar o bucket, execute este script SQL
6. Atualize a função get_product_image_url() com sua URL do Supabase

Exemplo de URL: https://seuprojetoid.supabase.co/storage/v1/object/public/product-images/
*/

