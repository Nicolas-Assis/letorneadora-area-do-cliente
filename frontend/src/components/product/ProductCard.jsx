import { Link } from 'react-router-dom'
import { Card, Button, Typography, Space, Image, Row, Col, Tag } from 'antd'
import { ShoppingCartOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useCartStore } from '../../lib/store'

const { Meta } = Card
const { Text, Paragraph } = Typography

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addItem } = useCartStore()

  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const imageUrl = primaryImage?.url || 'https://via.placeholder.com/300x200?text=Sem+Imagem'

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Modo lista (horizontal)
  if (viewMode === 'list') {
    return (
      <Card hoverable className="w-full">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <div className="relative overflow-hidden h-32">
              <Image
                alt={product.name}
                src={imageUrl}
                className="w-full h-full object-cover rounded"
                preview={false}
              />
            </div>
          </Col>
          
          <Col xs={24} sm={16} md={12}>
            <div className="space-y-2">
              <Link to={`/produtos/${product.slug}`}>
                <Text strong className="text-lg hover:text-blue-600 transition-colors">
                  {product.name}
                </Text>
              </Link>
              
              <div className="flex items-center space-x-2">
                <Text type="secondary" className="text-xs">
                  SKU: {product.sku}
                </Text>
                {product.category && (
                  <Tag color="blue" size="small">
                    {product.category.name}
                  </Tag>
                )}
                {product.stock_quantity > 0 && (
                  <Tag color="green" size="small" icon={<CheckCircleOutlined />}>
                    Em estoque
                  </Tag>
                )}
              </div>
              
              <Paragraph 
                ellipsis={{ rows: 2 }} 
                type="secondary" 
                className="text-sm mb-0"
              >
                {product.short_description || product.description}
              </Paragraph>
            </div>
          </Col>
          
          <Col xs={24} sm={24} md={6}>
            <div className="text-right space-y-3">
              <div>
                <Text strong className="text-xl text-blue-600">
                  {formatPrice(product.price)}
                </Text>
              </div>
              
              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  block
                >
                  Adicionar
                </Button>
                <Link to={`/produtos/${product.slug}`}>
                  <Button
                    icon={<EyeOutlined />}
                    block
                  >
                    Ver Detalhes
                  </Button>
                </Link>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>
    )
  }

  // Modo grid (vertical) - padrão
  return (
    <Card
      hoverable
      className="h-full"
      cover={
        <div className="relative overflow-hidden h-48">
          <Image
            alt={product.name}
            src={imageUrl}
            className="w-full h-full object-cover"
            preview={false}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <Link to={`/produtos/${product.slug}`}>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="large"
              >
                Ver Detalhes
              </Button>
            </Link>
          </div>
          
          {/* Tags de status */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.is_featured && (
              <Tag color="gold" size="small">
                Destaque
              </Tag>
            )}
            {product.stock_quantity > 0 ? (
              <Tag color="green" size="small" icon={<CheckCircleOutlined />}>
                Em estoque
              </Tag>
            ) : (
              <Tag color="red" size="small">
                Sob consulta
              </Tag>
            )}
          </div>
        </div>
      }
      actions={[
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          className="w-full"
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity > 0 ? 'Adicionar ao Carrinho' : 'Solicitar Orçamento'}
        </Button>
      ]}
    >
      <Link to={`/produtos/${product.slug}`}>
        <Meta
          title={
            <div className="space-y-1">
              <div className="truncate" title={product.name}>
                {product.name}
              </div>
              {product.category && (
                <Tag color="blue" size="small">
                  {product.category.name}
                </Tag>
              )}
            </div>
          }
          description={
            <div className="space-y-2">
              <Paragraph 
                ellipsis={{ rows: 2 }} 
                type="secondary" 
                className="text-sm"
              >
                {product.short_description || product.description}
              </Paragraph>
              
              <div className="flex justify-between items-center">
                <Text strong className="text-lg text-blue-600">
                  {formatPrice(product.price)}
                </Text>
                <Text type="secondary" className="text-xs">
                  SKU: {product.sku}
                </Text>
              </div>
              
              {product.stock_quantity !== undefined && (
                <div className="text-xs text-gray-500">
                  {product.stock_quantity > 0 
                    ? `${product.stock_quantity} em estoque`
                    : 'Consulte disponibilidade'
                  }
                </div>
              )}
            </div>
          }
        />
      </Link>
    </Card>
  )
}

export default ProductCard

