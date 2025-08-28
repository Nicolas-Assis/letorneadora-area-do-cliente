import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Layout, 
  Menu, 
  Button, 
  Badge, 
  Dropdown, 
  Avatar, 
  Input,
  Drawer,
  Space,
  Divider
} from 'antd'
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  SettingOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons'

// Stores
import { useAuthStore, useCartStore, useAppStore } from '../../lib/store'

const { Header: AntHeader } = Layout
const { Search } = Input

const Header = ({ onCartClick }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
  
  const { user, signOut } = useAuthStore()
  const { getTotalItems } = useCartStore()
  const { companyInfo } = useAppStore()
  
  const totalItems = getTotalItems()

  // Menu principal
  const menuItems = [
    {
      key: '/',
      label: <Link to="/">Início</Link>
    },
    {
      key: '/produtos',
      label: <Link to="/produtos">Produtos</Link>
    },
    {
      key: '/sobre',
      label: <Link to="/sobre">Sobre</Link>
    },
    {
      key: '/contato',
      label: <Link to="/contato">Contato</Link>
    },
    {
      key: '/faq',
      label: <Link to="/faq">FAQ</Link>
    }
  ]

  // Menu do usuário logado
  const userMenuItems = [
    {
      key: 'account',
      icon: <UserOutlined />,
      label: <Link to="/minha-conta">Minha Conta</Link>
    },
    {
      key: 'orders',
      icon: <FileTextOutlined />,
      label: <Link to="/meus-pedidos">Meus Pedidos</Link>
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: () => {
        signOut()
        navigate('/')
      }
    }
  ]

  // Menu do usuário não logado
  const guestMenuItems = [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: <Link to="/login">Entrar</Link>
    },
    {
      key: 'register',
      icon: <UserAddOutlined />,
      label: <Link to="/cadastro">Cadastrar</Link>
    }
  ]

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(value.trim())}`)
    }
  }

  const handleMobileMenuClose = () => {
    setMobileMenuVisible(false)
  }

  return (
    <>
      {/* Barra superior com informações de contato */}
      <div className="bg-gray-800 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <PhoneOutlined className="mr-2" />
                {companyInfo.phone}
              </span>
              <span className="flex items-center">
                <MailOutlined className="mr-2" />
                {companyInfo.email}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Horário: Seg-Sex 8h às 18h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <AntHeader className="bg-white shadow-md px-0 h-auto">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="text-2xl font-bold text-blue-600">
                  Le Torneadora
                </div>
              </Link>
            </div>

            {/* Menu desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                className="border-none bg-transparent"
              />
            </div>

            {/* Busca e ações */}
            <div className="flex items-center space-x-4">
              {/* Busca - desktop */}
              <div className="hidden md:block">
                <Search
                  placeholder="Buscar produtos..."
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  size="large"
                />
              </div>

              {/* Carrinho */}
              <Badge count={totalItems} size="small">
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  onClick={onCartClick}
                  className="flex items-center justify-center"
                />
              </Badge>

              {/* Menu do usuário */}
              <Dropdown
                menu={{ 
                  items: user ? userMenuItems : guestMenuItems 
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button
                  type="text"
                  size="large"
                  className="flex items-center"
                >
                  {user ? (
                    <Avatar size="small" icon={<UserOutlined />} />
                  ) : (
                    <UserOutlined />
                  )}
                  <span className="ml-2 hidden sm:inline">
                    {user ? user.email.split('@')[0] : 'Entrar'}
                  </span>
                </Button>
              </Dropdown>

              {/* Menu mobile */}
              <Button
                type="text"
                icon={<MenuOutlined />}
                size="large"
                className="lg:hidden"
                onClick={() => setMobileMenuVisible(true)}
              />
            </div>
          </div>

          {/* Busca mobile */}
          <div className="md:hidden pb-4">
            <Search
              placeholder="Buscar produtos..."
              allowClear
              onSearch={handleSearch}
              size="large"
            />
          </div>
        </div>
      </AntHeader>

      {/* Menu mobile drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={handleMobileMenuClose}
        open={mobileMenuVisible}
        width={280}
      >
        <div className="flex flex-col h-full">
          {/* Menu principal */}
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="border-none"
            onClick={handleMobileMenuClose}
          />

          <Divider />

          {/* Informações de contato */}
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center">
              <PhoneOutlined className="mr-2" />
              {companyInfo.phone}
            </div>
            <div className="flex items-center">
              <MailOutlined className="mr-2" />
              {companyInfo.email}
            </div>
          </div>

          {/* Ações do usuário */}
          <div className="mt-auto pt-4">
            {user ? (
              <Space direction="vertical" className="w-full">
                <Button 
                  type="primary" 
                  block 
                  icon={<UserOutlined />}
                  onClick={() => {
                    navigate('/minha-conta')
                    handleMobileMenuClose()
                  }}
                >
                  Minha Conta
                </Button>
                <Button 
                  block 
                  icon={<FileTextOutlined />}
                  onClick={() => {
                    navigate('/meus-pedidos')
                    handleMobileMenuClose()
                  }}
                >
                  Meus Pedidos
                </Button>
                <Button 
                  block 
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    signOut()
                    handleMobileMenuClose()
                    navigate('/')
                  }}
                >
                  Sair
                </Button>
              </Space>
            ) : (
              <Space direction="vertical" className="w-full">
                <Button 
                  type="primary" 
                  block 
                  icon={<LoginOutlined />}
                  onClick={() => {
                    navigate('/login')
                    handleMobileMenuClose()
                  }}
                >
                  Entrar
                </Button>
                <Button 
                  block 
                  icon={<UserAddOutlined />}
                  onClick={() => {
                    navigate('/cadastro')
                    handleMobileMenuClose()
                  }}
                >
                  Cadastrar
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default Header

