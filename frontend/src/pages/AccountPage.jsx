import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Tabs,
  Table,
  Tag,
  Statistic,
  Avatar,
  Space,
  Breadcrumb,
  Empty,
  Progress,
  Timeline,
  Descriptions,
  message
} from 'antd'
import {
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

// Stores
import { useAuthStore } from '../lib/store'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const { Title, Text, Paragraph } = Typography

const AccountPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const { user, signOut } = useAuthStore()

  // Redirecionar se não logado
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const handleLogout = async () => {
    try {
      await signOut()
      message.success('Logout realizado com sucesso!')
      navigate('/')
    } catch (error) {
      message.error('Erro ao fazer logout')
    }
  }

  // Buscar pedidos do usuário
  const { data: orders = [] } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!user?.id
  })

  // Buscar orçamentos do usuário
  const { data: quotes = [] } = useQuery({
    queryKey: ['user-quotes', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          quote_items(
            *,
            product:products(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!user?.id
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'approved': 'blue',
      'in_production': 'cyan',
      'completed': 'green',
      'cancelled': 'red',
      'draft': 'gray'
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'in_production': 'Em Produção',
      'completed': 'Concluído',
      'cancelled': 'Cancelado',
      'draft': 'Rascunho'
    }
    return texts[status] || status
  }

  const ordersColumns = [
    {
      title: 'Pedido',
      dataIndex: 'order_number',
      key: 'order_number',
      render: (text) => <Text strong>#{text}</Text>
    },
    {
      title: 'Data',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => formatDate(date)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => <Text strong>{formatPrice(amount)}</Text>
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/pedido/${record.id}`)}
        >
          Ver Detalhes
        </Button>
      )
    }
  ]

  const quotesColumns = [
    {
      title: 'Orçamento',
      dataIndex: 'quote_number',
      key: 'quote_number',
      render: (text) => <Text strong>#{text}</Text>
    },
    {
      title: 'Data',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => formatDate(date)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Valor',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => amount ? <Text strong>{formatPrice(amount)}</Text> : <Text type="secondary">Aguardando</Text>
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/orcamento/${record.id}`)}
        >
          Ver Detalhes
        </Button>
      )
    }
  ]

  const recentOrders = orders.slice(0, 3)
  const recentQuotes = quotes.slice(0, 3)

  const tabItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <UserOutlined />,
      children: (
        <div className="space-y-6">
          {/* Estatísticas */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total de Pedidos"
                  value={orders.length}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Orçamentos Solicitados"
                  value={quotes.length}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Pedidos em Andamento"
                  value={orders.filter(o => ['approved', 'in_production'].includes(o.status)).length}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Pedidos Recentes */}
          <Card title="Pedidos Recentes" extra={<Link to="/minha-conta?tab=orders">Ver Todos</Link>}>
            {recentOrders.length > 0 ? (
              <Table
                dataSource={recentOrders}
                columns={ordersColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="Nenhum pedido encontrado" />
            )}
          </Card>

          {/* Orçamentos Recentes */}
          <Card title="Orçamentos Recentes" extra={<Link to="/minha-conta?tab=quotes">Ver Todos</Link>}>
            {recentQuotes.length > 0 ? (
              <Table
                dataSource={recentQuotes}
                columns={quotesColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="Nenhum orçamento encontrado" />
            )}
          </Card>

          {/* Ações Rápidas */}
          <Card title="Ações Rápidas">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Link to="/produtos">
                  <Button type="primary" block size="large">
                    Solicitar Novo Orçamento
                  </Button>
                </Link>
              </Col>
              <Col xs={24} sm={8}>
                <Link to="/contato">
                  <Button block size="large">
                    Entrar em Contato
                  </Button>
                </Link>
              </Col>
              <Col xs={24} sm={8}>
                <Link to="/faq">
                  <Button block size="large">
                    Central de Ajuda
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'orders',
      label: 'Meus Pedidos',
      icon: <ShoppingOutlined />,
      children: (
        <Card title="Histórico de Pedidos">
          {orders.length > 0 ? (
            <Table
              dataSource={orders}
              columns={ordersColumns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} pedidos`
              }}
            />
          ) : (
            <Empty 
              description="Nenhum pedido encontrado"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Link to="/produtos">
                <Button type="primary">Fazer Primeiro Pedido</Button>
              </Link>
            </Empty>
          )}
        </Card>
      )
    },
    {
      key: 'quotes',
      label: 'Meus Orçamentos',
      icon: <FileTextOutlined />,
      children: (
        <Card title="Histórico de Orçamentos">
          {quotes.length > 0 ? (
            <Table
              dataSource={quotes}
              columns={quotesColumns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} orçamentos`
              }}
            />
          ) : (
            <Empty 
              description="Nenhum orçamento encontrado"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Link to="/produtos">
                <Button type="primary">Solicitar Primeiro Orçamento</Button>
              </Link>
            </Empty>
          )}
        </Card>
      )
    },
    {
      key: 'profile',
      label: 'Meu Perfil',
      icon: <SettingOutlined />,
      children: (
        <Card title="Informações Pessoais">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Nome">
              {user.user_metadata?.name || 'Não informado'}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Telefone">
              {user.user_metadata?.phone || 'Não informado'}
            </Descriptions.Item>
            <Descriptions.Item label="Data de Cadastro">
              {formatDate(user.created_at)}
            </Descriptions.Item>
            <Descriptions.Item label="Último Acesso">
              {formatDate(user.last_sign_in_at)}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6 space-y-4">
            <Button type="primary">
              Editar Perfil
            </Button>
            <Button>
              Alterar Senha
            </Button>
          </div>
        </Card>
      )
    }
  ]

  return (
    <>
      <Helmet>
        <title>Minha Conta - Le Torneadora</title>
        <meta name="description" content="Área do cliente - Acompanhe seus pedidos e orçamentos" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <Breadcrumb.Item>
              <HomeOutlined />
              <span className="ml-1">Início</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Minha Conta</Breadcrumb.Item>
          </Breadcrumb>

          {/* Cabeçalho */}
          <Card className="mb-6">
            <Row justify="space-between" align="middle">
              <Col>
                <div className="flex items-center space-x-4">
                  <Avatar size={64} icon={<UserOutlined />} />
                  <div>
                    <Title level={2} className="mb-1">
                      Olá, {user.user_metadata?.name || 'Cliente'}!
                    </Title>
                    <Text type="secondary">
                      Bem-vindo à sua área pessoal
                    </Text>
                  </div>
                </div>
              </Col>
              <Col>
                <Button 
                  danger 
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Conteúdo Principal */}
          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              tabPosition="left"
              className="min-h-96"
            />
          </Card>
        </div>
      </div>
    </>
  )
}

export default AccountPage
