import { Link } from 'react-router-dom'
import { 
  Drawer, 
  List, 
  Button, 
  Typography, 
  Space, 
  Image, 
  InputNumber,
  Divider,
  Empty
} from 'antd'
import { 
  DeleteOutlined, 
  ShoppingOutlined,
  ArrowRightOutlined 
} from '@ant-design/icons'
import { useCartStore } from '../../lib/store'

const { Title, Text } = Typography

const CartDrawer = ({ visible, onClose }) => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleQuantityChange = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, quantity)
    }
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <Drawer
      title={
        <div className="flex items-center">
          <ShoppingOutlined className="mr-2" />
          Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      footer={
        items.length > 0 && (
          <div className="space-y-4">
            <Divider className="my-4" />
            <div className="flex justify-between items-center">
              <Text strong className="text-lg">Total:</Text>
              <Title level={4} className="text-blue-600 m-0">
                {formatPrice(totalPrice)}
              </Title>
            </div>
            <Space direction="vertical" className="w-full">
              <Button 
                type="primary" 
                size="large" 
                block
                onClick={onClose}
              >
                <Link to="/carrinho">
                  Ver Carrinho Completo
                </Link>
              </Button>
              <Button 
                size="large" 
                block
                onClick={onClose}
              >
                <Link to="/orcamento">
                  Solicitar Orçamento
                  <ArrowRightOutlined />
                </Link>
              </Button>
            </Space>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Seu carrinho está vazio"
          />
          <Button 
            type="primary" 
            className="mt-4"
            onClick={onClose}
          >
            <Link to="/produtos">
              Continuar Comprando
            </Link>
          </Button>
        </div>
      ) : (
        <List
          dataSource={items}
          renderItem={(item) => {
            const primaryImage = item.product.images?.find(img => img.is_primary) || item.product.images?.[0]
            const imageUrl = primaryImage?.url || 'https://via.placeholder.com/80x80?text=Produto'

            return (
              <List.Item className="px-0">
                <div className="flex w-full space-x-3">
                  <Image
                    src={imageUrl}
                    alt={item.product.name}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                    preview={false}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="space-y-2">
                      <Text strong className="text-sm line-clamp-2">
                        {item.product.name}
                      </Text>
                      
                      <div className="flex items-center justify-between">
                        <Text className="text-blue-600 font-medium">
                          {formatPrice(item.product.price)}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          SKU: {item.product.sku}
                        </Text>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <InputNumber
                          min={1}
                          max={99}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(item.product.id, value)}
                          size="small"
                          className="w-20"
                        />
                        
                        <div className="flex items-center space-x-2">
                          <Text strong className="text-sm">
                            {formatPrice(item.product.price * item.quantity)}
                          </Text>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => removeItem(item.product.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </List.Item>
            )
          }}
        />
      )}
    </Drawer>
  )
}

export default CartDrawer

