import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Layout, BackTop } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'

// Components
import Header from './Header'
import Footer from './Footer'
import CartDrawer from '../common/CartDrawer'

const { Content } = Layout

const MainLayout = () => {
  const location = useLocation()
  const [cartVisible, setCartVisible] = useState(false)

  // Páginas que não devem ter o layout completo (ex: login, checkout)
  const minimalLayoutPages = ['/login', '/cadastro']
  const isMinimalLayout = minimalLayoutPages.includes(location.pathname)

  return (
    <Layout className="min-h-screen">
      <Header onCartClick={() => setCartVisible(true)} />
      
      <Content className="flex-1">
        <Outlet />
      </Content>
      
      {!isMinimalLayout && <Footer />}
      
      {/* Carrinho lateral */}
      <CartDrawer 
        visible={cartVisible} 
        onClose={() => setCartVisible(false)} 
      />
      
      {/* Botão voltar ao topo */}
      <BackTop>
        <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors">
          <ArrowUpOutlined />
        </div>
      </BackTop>
    </Layout>
  )
}

export default MainLayout

