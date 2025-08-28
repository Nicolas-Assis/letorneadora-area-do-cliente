import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Space,
  Table,
  InputNumber,
  Image,
  Divider,
  Empty,
  Breadcrumb,
  Alert,
  Statistic,
  Tag
} from 'antd'
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  MinusOutlined,
  PlusOutlined,
  ClearOutlined
} from '@ant-design/icons'

// Stores
import { useCartStore } from '../lib/store'

const { Title, Text } = Typography

const CartPage = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart,
    getTotalItems, 
    getTotalPrice 
  } = useCartStore()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const columns = [
    {
      title: 'Produto',
      dataIndex: 'product',
      key: 'product',
      render: (product, record) => {
        const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
        const imageUrl = primaryImage?.url || 'https://via.placeholder.com/80x80?text=Produto'

        return (
          <div className="flex items-center space-x-4">
            <Image
              src={imageUrl}
              alt={product.name}
              width={60}
              height={60}
              className="rounded object-cover"
              preview={false}
            />
            <div className="flex-1 min-w-0">
              <Link 
                to={`/produtos/${product.slug}`}
                className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {product.name}
              </Link>
              <div className="text-sm text-gray-500 mt-1">
                SKU: {product.sku}
              </div>
              {product.category && (
                <Tag color="blue" size="small" className="mt-1">
                  {product.category.name}
                </Tag>
              )}
            </div>
          </div>
        )
      }
    },
    {
      title: 'Preço Unit.',
      dataIndex: 'product',
      key: 'price',
      align: 'center',
      render: (product) => (
        <Text strong className="text-blue-600">
          {formatPrice(product.price)}
        </Text>
      )
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity, record) => (
        <div className="flex items-center justify-center space-x-2">
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(record.product.id, quantity - 1)}
          />
          <InputNumber
            min={1}
            max={99}
            value={quantity}
            onChange={(value) => handleQuantityChange(record.product.id, value)}
            className="w-16 text-center"
            size="small"
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(record.product.id, quantity + 1)}
          />
        </div>
      )
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      align: 'center',
      render: (_, record) => (
        <Text strong className="text-lg">
          {formatPrice(record.product.price * record.quantity)}
        </Text>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.product.id)}
          title="Remover item"
        />
      )
    }
  ]

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Carrinho - Le Torneadora</title>
          <meta name="description" content="Seu carrinho de compras na Le Torneadora" />
        </Helmet>

        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <Breadcrumb.Item>
                <HomeOutlined />
                <span className="ml-1">Início</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Carrinho</Breadcrumb.Item>
            </Breadcrumb>

            <Card>
              <div className="text-center py-12">
                <Empty
                  image={<ShoppingOutlined className="text-6xl text-gray-300" />}
                  description={
                    <div className="space-y-2">
                      <Title level={3} type="secondary">
                        Seu carrinho está vazio
                      </Title>
                      <Text type="secondary">
                        Adicione produtos ao carrinho para solicitar um orçamento
                      </Text>
                    </div>
                  }
                >
                  <Link to="/produtos">
                    <Button type="primary" size="large">
                      Continuar Comprando
                    </Button>
                  </Link>
                </Empty>
              </div>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'}) - Le Torneadora</title>
        <meta name="description" content="Revise os produtos em seu carrinho e solicite um orçamento" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <Breadcrumb.Item>
              <HomeOutlined />
              <span className="ml-1">Início</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Carrinho</Breadcrumb.Item>
          </Breadcrumb>

          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={1} className="mb-2">
                Meu Carrinho
              </Title>
              <Text type="secondary" className="text-lg">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
              </Text>
            </div>
            <Button 
              danger 
              icon={<ClearOutlined />}
              onClick={clearCart}
            >
              Limpar Carrinho
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {/* Lista de Produtos */}
            <Col xs={24} lg={16}>
              <Card title="Produtos Selecionados">
                <Table
                  dataSource={items}
                  columns={columns}
                  rowKey={(record) => record.product.id}
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </Card>

              {/* Ações do Carrinho */}
              <Card className="mt-6">
                <Row gutter={[16, 16]} justify="space-between" align="middle">
                  <Col>
                    <Link to="/produtos">
                      <Button size="large">
                        Continuar Comprando
                      </Button>
                    </Link>
                  </Col>
                  <Col>
                    <Space>
                      <Button 
                        size="large"
                        onClick={clearCart}
                        icon={<ClearOutlined />}
                      >
                        Limpar Carrinho
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Resumo do Pedido */}
            <Col xs={24} lg={8}>
              <Card title="Resumo do Pedido" className="sticky top-4">
                <div className="space-y-4">
                  {/* Estatísticas */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Text>Total de itens:</Text>
                      <Text strong>{totalItems}</Text>
                    </div>
                    
                    <Divider className="my-3" />
                    
                    <div className="flex justify-between items-center">
                      <Text strong className="text-lg">Total:</Text>
                      <Statistic
                        value={totalPrice}
                        precision={2}
                        prefix="R$"
                        valueStyle={{ 
                          color: '#1890ff', 
                          fontSize: '1.5rem',
                          fontWeight: 'bold'
                        }}
                      />
                    </div>
                  </div>

                  <Divider />

                  {/* Informações sobre orçamento */}
                  <Alert
                    message="Orçamento Personalizado"
                    description="Os preços são informativos. Você receberá um orçamento detalhado com valores finais, prazos e condições de pagamento."
                    type="info"
                    showIcon
                    className="mb-4"
                  />

                  {/* Botões de Ação */}
                  <Space direction="vertical" className="w-full">
                    <Link to="/orcamento">
                      <Button 
                        type="primary" 
                        size="large" 
                        block
                        icon={<ArrowRightOutlined />}
                      >
                        Solicitar Orçamento
                      </Button>
                    </Link>
                    
                    <Text type="secondary" className="text-center text-sm">
                      Resposta em até 24 horas
                    </Text>
                  </Space>

                  <Divider />

                  {/* Informações de Contato */}
                  <div className="text-center space-y-2">
                    <Text strong>Precisa de ajuda?</Text>
                    <div className="space-y-1 text-sm">
                      <div>📞 (11) 3456-7890</div>
                      <div>📧 contato@letorneadora.com.br</div>
                      <div>💬 WhatsApp: (11) 98765-4321</div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default CartPage

