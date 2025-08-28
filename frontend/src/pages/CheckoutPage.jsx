import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Form,
  Input,
  Select,
  Steps,
  Divider,
  Alert,
  Breadcrumb,
  Table,
  Image,
  message,
  Modal
} from 'antd'
import {
  UserOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons'

// Stores
import { useCartStore, useAuthStore } from '../lib/store'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  // Redirecionar se carrinho vazio
  if (items.length === 0 && !orderSuccess) {
    navigate('/carrinho')
    return null
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const steps = [
    {
      title: 'Dados Pessoais',
      icon: <UserOutlined />
    },
    {
      title: 'Endereço',
      icon: <EnvironmentOutlined />
    },
    {
      title: 'Detalhes do Pedido',
      icon: <FileTextOutlined />
    },
    {
      title: 'Confirmação',
      icon: <CheckCircleOutlined />
    }
  ]

  const handleNext = async () => {
    try {
      await form.validateFields()
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      // Simular envio do orçamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Limpar carrinho e mostrar sucesso
      clearCart()
      setOrderSuccess(true)
      setCurrentStep(3)
      
      message.success('Solicitação de orçamento enviada com sucesso!')
    } catch (error) {
      message.error('Erro ao enviar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Produto',
      dataIndex: 'product',
      key: 'product',
      render: (product, record) => {
        const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
        const imageUrl = primaryImage?.url || 'https://via.placeholder.com/60x60?text=Produto'

        return (
          <div className="flex items-center space-x-3">
            <Image
              src={imageUrl}
              alt={product.name}
              width={40}
              height={40}
              className="rounded object-cover"
              preview={false}
            />
            <div>
              <Text strong className="text-sm">{product.name}</Text>
              <div className="text-xs text-gray-500">SKU: {product.sku}</div>
            </div>
          </div>
        )
      }
    },
    {
      title: 'Qtd',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 60
    },
    {
      title: 'Preço',
      key: 'price',
      align: 'right',
      render: (_, record) => (
        <Text>{formatPrice(record.product.price * record.quantity)}</Text>
      )
    }
  ]

  if (orderSuccess) {
    return (
      <>
        <Helmet>
          <title>Orçamento Solicitado - Le Torneadora</title>
        </Helmet>

        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto text-center">
              <div className="py-8">
                <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
                <Title level={2} className="text-green-600 mb-4">
                  Orçamento Solicitado com Sucesso!
                </Title>
                <Paragraph className="text-lg mb-6">
                  Sua solicitação foi recebida e nossa equipe entrará em contato 
                  em até 24 horas com um orçamento detalhado.
                </Paragraph>
                
                <Alert
                  message="Próximos Passos"
                  description={
                    <div className="text-left space-y-2">
                      <div>• Análise técnica dos produtos solicitados</div>
                      <div>• Cálculo de prazos e valores</div>
                      <div>• Contato via email ou telefone</div>
                      <div>• Envio do orçamento detalhado</div>
                    </div>
                  }
                  type="info"
                  showIcon
                  className="mb-6 text-left"
                />

                <div className="space-y-4">
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => navigate('/produtos')}
                  >
                    Continuar Comprando
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    <div>📞 (11) 3456-7890</div>
                    <div>📧 contato@letorneadora.com.br</div>
                  </div>
                </div>
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
        <title>Solicitar Orçamento - Le Torneadora</title>
        <meta name="description" content="Finalize sua solicitação de orçamento na Le Torneadora" />
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
            <Breadcrumb.Item>Orçamento</Breadcrumb.Item>
          </Breadcrumb>

          {/* Cabeçalho */}
          <div className="mb-8">
            <Title level={1} className="mb-2">
              Solicitar Orçamento
            </Title>
            <Text type="secondary" className="text-lg">
              Preencha os dados abaixo para receber seu orçamento personalizado
            </Text>
          </div>

          {/* Steps */}
          <Card className="mb-6">
            <Steps current={currentStep} items={steps} />
          </Card>

          <Row gutter={[24, 24]}>
            {/* Formulário */}
            <Col xs={24} lg={16}>
              <Card>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    name: user?.user_metadata?.name || '',
                    email: user?.email || '',
                    company_type: 'pessoa_fisica'
                  }}
                >
                  {/* Passo 1: Dados Pessoais */}
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <Title level={3}>Dados Pessoais</Title>
                      
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="name"
                            label="Nome Completo"
                            rules={[{ required: true, message: 'Nome é obrigatório' }]}
                          >
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: 'Email é obrigatório' },
                              { type: 'email', message: 'Email inválido' }
                            ]}
                          >
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="phone"
                            label="Telefone"
                            rules={[{ required: true, message: 'Telefone é obrigatório' }]}
                          >
                            <Input size="large" placeholder="(11) 99999-9999" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="company_type"
                            label="Tipo de Cliente"
                            rules={[{ required: true }]}
                          >
                            <Select size="large">
                              <Option value="pessoa_fisica">Pessoa Física</Option>
                              <Option value="pessoa_juridica">Pessoa Jurídica</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => 
                          prevValues.company_type !== currentValues.company_type
                        }
                      >
                        {({ getFieldValue }) =>
                          getFieldValue('company_type') === 'pessoa_juridica' && (
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  name="company_name"
                                  label="Razão Social"
                                  rules={[{ required: true, message: 'Razão social é obrigatória' }]}
                                >
                                  <Input size="large" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  name="cnpj"
                                  label="CNPJ"
                                  rules={[{ required: true, message: 'CNPJ é obrigatório' }]}
                                >
                                  <Input size="large" placeholder="00.000.000/0000-00" />
                                </Form.Item>
                              </Col>
                            </Row>
                          )
                        }
                      </Form.Item>
                    </div>
                  )}

                  {/* Passo 2: Endereço */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <Title level={3}>Endereço de Entrega</Title>
                      
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            name="zip_code"
                            label="CEP"
                            rules={[{ required: true, message: 'CEP é obrigatório' }]}
                          >
                            <Input size="large" placeholder="00000-000" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={16}>
                          <Form.Item
                            name="street"
                            label="Endereço"
                            rules={[{ required: true, message: 'Endereço é obrigatório' }]}
                          >
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            name="number"
                            label="Número"
                            rules={[{ required: true, message: 'Número é obrigatório' }]}
                          >
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={16}>
                          <Form.Item
                            name="complement"
                            label="Complemento"
                          >
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="neighborhood"
                            label="Bairro"
                            rules={[{ required: true, message: 'Bairro é obrigatório' }]}
                          >
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            name="city"
                            label="Cidade"
                            rules={[{ required: true, message: 'Cidade é obrigatória' }]}
                          >
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={4}>
                          <Form.Item
                            name="state"
                            label="UF"
                            rules={[{ required: true, message: 'UF é obrigatório' }]}
                          >
                            <Select size="large" placeholder="SP">
                              <Option value="SP">SP</Option>
                              <Option value="RJ">RJ</Option>
                              <Option value="MG">MG</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {/* Passo 3: Detalhes do Pedido */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <Title level={3}>Detalhes do Pedido</Title>
                      
                      <Form.Item
                        name="urgency"
                        label="Urgência do Pedido"
                        rules={[{ required: true }]}
                      >
                        <Select size="large">
                          <Option value="normal">Normal (15-20 dias úteis)</Option>
                          <Option value="urgente">Urgente (7-10 dias úteis)</Option>
                          <Option value="expressa">Expressa (3-5 dias úteis)</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="notes"
                        label="Observações Adicionais"
                      >
                        <TextArea
                          rows={4}
                          placeholder="Descreva detalhes técnicos, especificações especiais, desenhos técnicos ou qualquer informação adicional relevante para o orçamento..."
                        />
                      </Form.Item>

                      <Alert
                        message="Informações Importantes"
                        description={
                          <div className="space-y-1">
                            <div>• Os preços mostrados são estimativas</div>
                            <div>• O orçamento final pode variar conforme especificações</div>
                            <div>• Prazos podem ser ajustados conforme complexidade</div>
                            <div>• Desenhos técnicos podem ser enviados posteriormente</div>
                          </div>
                        }
                        type="info"
                        showIcon
                      />
                    </div>
                  )}
                </Form>

                {/* Botões de Navegação */}
                <Divider />
                <div className="flex justify-between">
                  <Button 
                    size="large"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                  >
                    Voltar
                  </Button>
                  
                  {currentStep < 2 ? (
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={handleNext}
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button 
                      type="primary" 
                      size="large"
                      loading={loading}
                      onClick={handleSubmit}
                    >
                      Solicitar Orçamento
                    </Button>
                  )}
                </div>
              </Card>
            </Col>

            {/* Resumo do Pedido */}
            <Col xs={24} lg={8}>
              <Card title="Resumo do Pedido" className="sticky top-4">
                <div className="space-y-4">
                  <Table
                    dataSource={items}
                    columns={columns}
                    rowKey={(record) => record.product.id}
                    pagination={false}
                    size="small"
                  />

                  <Divider />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text>Total de itens:</Text>
                      <Text strong>{totalItems}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text strong>Total estimado:</Text>
                      <Text strong className="text-blue-600 text-lg">
                        {formatPrice(totalPrice)}
                      </Text>
                    </div>
                  </div>

                  <Alert
                    message="Valor Estimativo"
                    description="Este é um valor de referência. O orçamento final será calculado com base nas especificações técnicas."
                    type="warning"
                    showIcon
                    size="small"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default CheckoutPage
