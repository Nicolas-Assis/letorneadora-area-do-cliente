import { Link } from 'react-router-dom'
import { Layout, Row, Col, Space, Divider } from 'antd'
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  WhatsAppOutlined
} from '@ant-design/icons'

import { useAppStore } from '../../lib/store'

const { Footer: AntFooter } = Layout

const Footer = () => {
  const { companyInfo } = useAppStore()

  return (
    <AntFooter className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <Row gutter={[32, 32]}>
          {/* Informações da empresa */}
          <Col xs={24} sm={12} lg={6}>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">
                Le Torneadora
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Especialista em usinagem de precisão, peças torneadas e ferramentaria. 
                Qualidade e pontualidade garantidas.
              </p>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com/letorneadora" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FacebookOutlined className="text-lg" />
                </a>
                <a 
                  href="https://instagram.com/letorneadora" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <InstagramOutlined className="text-lg" />
                </a>
                <a 
                  href="https://linkedin.com/company/letorneadora" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <LinkedinOutlined className="text-lg" />
                </a>
                <a 
                  href={`https://wa.me/${companyInfo.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <WhatsAppOutlined className="text-lg" />
                </a>
              </div>
            </div>
          </Col>

          {/* Links rápidos */}
          <Col xs={24} sm={12} lg={6}>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Links Rápidos
              </h4>
              <div className="space-y-2">
                <div>
                  <Link 
                    to="/" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Início
                  </Link>
                </div>
                <div>
                  <Link 
                    to="/produtos" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Produtos
                  </Link>
                </div>
                <div>
                  <Link 
                    to="/sobre" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Sobre Nós
                  </Link>
                </div>
                <div>
                  <Link 
                    to="/contato" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Contato
                  </Link>
                </div>
                <div>
                  <Link 
                    to="/faq" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    FAQ
                  </Link>
                </div>
              </div>
            </div>
          </Col>

          {/* Atendimento */}
          <Col xs={24} sm={12} lg={6}>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Atendimento
              </h4>
              <div className="space-y-2">
                <div>
                  <Link 
                    to="/suporte" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Suporte Técnico
                  </Link>
                </div>
                <div>
                  <Link 
                    to="/meus-pedidos" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Acompanhar Pedido
                  </Link>
                </div>
                <div>
                  <Link 
                    to="/orcamento" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Solicitar Orçamento
                  </Link>
                </div>
                <div>
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Área do Cliente
                  </Link>
                </div>
              </div>
            </div>
          </Col>

          {/* Contato */}
          <Col xs={24} sm={12} lg={6}>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Contato
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <EnvironmentOutlined className="text-gray-400 mt-1" />
                  <div className="text-gray-300 text-sm">
                    <div>Rua das Indústrias, 1234</div>
                    <div>Distrito Industrial</div>
                    <div>São Paulo - SP</div>
                    <div>CEP: 01234-567</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <PhoneOutlined className="text-gray-400" />
                  <span className="text-gray-300 text-sm">
                    {companyInfo.phone}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MailOutlined className="text-gray-400" />
                  <span className="text-gray-300 text-sm">
                    {companyInfo.email}
                  </span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ClockCircleOutlined className="text-gray-400 mt-1" />
                  <div className="text-gray-300 text-sm">
                    <div>Segunda a Sexta</div>
                    <div>8h às 18h</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="border-gray-600 my-8" />

        {/* Copyright */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Le Torneadora. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link 
                to="/politica-privacidade" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link 
                to="/termos-uso" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AntFooter>
  )
}

export default Footer

