import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ptBR from 'antd/locale/pt_BR'
import { HelmetProvider } from 'react-helmet-async'

// Stores
import { useAuthStore, useAppStore } from './lib/store'

// Layouts
import MainLayout from './components/layouts/MainLayout'

// Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import SupportPage from './pages/SupportPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import OrdersPage from './pages/OrdersPage'
import NotFoundPage from './pages/NotFoundPage'

import './App.css'

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

// Tema personalizado do Ant Design
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#1890ff',
    },
    Button: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 8,
    },
  },
}

function App() {
  const { initialize } = useAuthStore()
  const { loadCompanyInfo } = useAppStore()

  useEffect(() => {
    // Inicializar autenticação e configurações
    const initializeApp = async () => {
      await initialize()
      await loadCompanyInfo()
    }
    
    initializeApp()
  }, [initialize, loadCompanyInfo])

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider 
          locale={ptBR} 
          theme={theme}
        >
          <AntApp>
            <Router>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="produtos" element={<ProductsPage />} />
                  <Route path="produtos/:slug" element={<ProductDetailPage />} />
                  <Route path="categoria/:slug" element={<CategoryPage />} />
                  <Route path="carrinho" element={<CartPage />} />
                  <Route path="orcamento" element={<CheckoutPage />} />
                  <Route path="sobre" element={<AboutPage />} />
                  <Route path="contato" element={<ContactPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="suporte" element={<SupportPage />} />
                  
                  {/* Rotas de autenticação */}
                  <Route path="login" element={<LoginPage />} />
                  <Route path="cadastro" element={<RegisterPage />} />
                  
                  {/* Rotas protegidas (área do cliente) */}
                  <Route path="minha-conta" element={<AccountPage />} />
                  <Route path="meus-pedidos" element={<OrdersPage />} />
                  
                  {/* Página 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Router>
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
