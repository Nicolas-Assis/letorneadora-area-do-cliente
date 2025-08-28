import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Form,
  Input,
  Tabs,
  Divider,
  Alert,
  message
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons'

// Stores
import { useAuthStore } from '../lib/store'

const { Title, Text, Paragraph } = Typography

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuthStore()

  // Redirect após login
  const from = location.state?.from?.pathname || '/minha-conta'

  const handleLogin = async (values) => {
    try {
      setLoading(true)
      await signIn(values.email, values.password)
      message.success('Login realizado com sucesso!')
      navigate(from, { replace: true })
    } catch (error) {
      message.error(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (values) => {
    try {
      setLoading(true)
      await signUp(values.email, values.password, {
        name: values.name,
        phone: values.phone
      })
      message.success('Conta criada com sucesso! Verifique seu email.')
      setActiveTab('login')
    } catch (error) {
      message.error(error.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const tabItems = [
    {
      key: 'login',
      label: 'Entrar',
      children: (
        <Form
          form={loginForm}
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email é obrigatório' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="seu@email.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Senha"
            rules={[{ required: true, message: 'Senha é obrigatória' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Sua senha"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Link to="/esqueci-senha" className="text-blue-600 hover:text-blue-800">
                Esqueci minha senha
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              size="large"
            >
              Entrar
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'register',
      label: 'Criar Conta',
      children: (
        <Form
          form={registerForm}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            label="Nome Completo"
            rules={[{ required: true, message: 'Nome é obrigatório' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Seu nome completo"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email é obrigatório' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="seu@email.com"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone"
            rules={[{ required: true, message: 'Telefone é obrigatório' }]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="(11) 99999-9999"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Senha"
            rules={[
              { required: true, message: 'Senha é obrigatória' },
              { min: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Crie uma senha"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar Senha"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirme sua senha' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('As senhas não coincidem'))
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirme sua senha"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              size="large"
            >
              Criar Conta
            </Button>
          </Form.Item>

          <Form.Item>
            <Text type="secondary" className="text-xs">
              Ao criar uma conta, você concorda com nossos{' '}
              <Link to="/termos" className="text-blue-600">Termos de Uso</Link>
              {' '}e{' '}
              <Link to="/privacidade" className="text-blue-600">Política de Privacidade</Link>
            </Text>
          </Form.Item>
        </Form>
      )
    }
  ]

  return (
    <>
      <Helmet>
        <title>Login - Le Torneadora</title>
        <meta name="description" content="Acesse sua conta na Le Torneadora" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                Le Torneadora
              </div>
            </Link>
            <Title level={2} className="mb-2">
              {activeTab === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </Title>
            <Text type="secondary">
              {activeTab === 'login' 
                ? 'Acesse sua conta para acompanhar pedidos e orçamentos'
                : 'Cadastre-se para solicitar orçamentos e acompanhar pedidos'
              }
            </Text>
          </div>

          {/* Formulário */}
          <Card>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              items={tabItems}
              centered
            />
          </Card>

          {/* Links Adicionais */}
          <div className="text-center mt-6 space-y-2">
            <div>
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                ← Voltar ao site
              </Link>
            </div>
            
            <Divider>ou</Divider>
            
            <div className="space-y-2">
              <Paragraph type="secondary" className="text-sm">
                Precisa de ajuda? Entre em contato:
              </Paragraph>
              <div className="text-sm space-y-1">
                <div>📞 (11) 3456-7890</div>
                <div>📧 contato@letorneadora.com.br</div>
                <div>💬 WhatsApp: (11) 98765-4321</div>
              </div>
            </div>
          </div>

          {/* Benefícios de ter conta */}
          <Card className="mt-6" size="small">
            <Title level={5} className="mb-3">
              Vantagens de ter uma conta:
            </Title>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Acompanhe seus orçamentos em tempo real</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Histórico completo de pedidos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Checkout mais rápido</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Notificações sobre status dos pedidos</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default LoginPage
