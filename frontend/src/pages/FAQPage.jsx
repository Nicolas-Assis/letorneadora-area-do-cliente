import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Collapse,
  Input,
  Button,
  Space,
  Breadcrumb,
  Divider,
  Alert,
  Tag
} from 'antd'
import {
  SearchOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  WhatsAppOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ToolOutlined,
  TruckOutlined,
  SafetyOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse
const { Search } = Input

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { key: 'all', label: 'Todas', icon: <QuestionCircleOutlined /> },
    { key: 'services', label: 'Serviços', icon: <ToolOutlined /> },
    { key: 'pricing', label: 'Preços', icon: <DollarOutlined /> },
    { key: 'delivery', label: 'Entrega', icon: <TruckOutlined /> },
    { key: 'quality', label: 'Qualidade', icon: <SafetyOutlined /> },
    { key: 'process', label: 'Processo', icon: <ClockCircleOutlined /> }
  ]

  const faqs = [
    {
      id: 1,
      category: 'services',
      question: 'Quais tipos de usinagem vocês fazem?',
      answer: 'Oferecemos uma ampla gama de serviços de usinagem, incluindo torneamento CNC, fresamento, furação, rosqueamento, retificação e usinagem de precisão. Trabalhamos com diversos materiais como aço, alumínio, latão, bronze, aço inoxidável e plásticos técnicos.'
    },
    {
      id: 2,
      category: 'services',
      question: 'Vocês trabalham com desenhos técnicos do cliente?',
      answer: 'Sim! Aceitamos desenhos técnicos em diversos formatos (PDF, DWG, STEP, etc.). Nossa equipe técnica analisa cada projeto para garantir a viabilidade e sugerir melhorias quando necessário. Também oferecemos consultoria para otimização de projetos.'
    },
    {
      id: 3,
      category: 'pricing',
      question: 'Como funciona o orçamento?',
      answer: 'O orçamento é gratuito e personalizado. Você pode solicitar através do nosso site, enviando as especificações do produto. Nossa equipe analisa o projeto e retorna com um orçamento detalhado em até 24 horas, incluindo prazos e condições de pagamento.'
    },
    {
      id: 4,
      category: 'pricing',
      question: 'Qual o valor mínimo de pedido?',
      answer: 'Não temos valor mínimo de pedido. Atendemos desde peças unitárias até grandes lotes de produção. Nosso foco é oferecer soluções personalizadas para cada necessidade, independente da quantidade.'
    },
    {
      id: 5,
      category: 'delivery',
      question: 'Qual o prazo de entrega?',
      answer: 'Os prazos variam conforme a complexidade e quantidade das peças. Geralmente: peças simples (5-10 dias), peças complexas (10-15 dias), lotes grandes (15-30 dias). Oferecemos também serviço expresso para urgências.'
    },
    {
      id: 6,
      category: 'delivery',
      question: 'Vocês fazem entrega em todo o Brasil?',
      answer: 'Sim, fazemos entregas para todo o território nacional através de transportadoras parceiras. O frete é calculado conforme o peso, dimensões e destino. Para a região metropolitana de São Paulo, oferecemos entrega própria.'
    },
    {
      id: 7,
      category: 'quality',
      question: 'Que tipo de controle de qualidade vocês fazem?',
      answer: 'Temos um rigoroso controle de qualidade com instrumentos calibrados. Todas as peças passam por inspeção dimensional, verificação de acabamento superficial e testes funcionais quando aplicável. Fornecemos certificados de qualidade quando solicitado.'
    },
    {
      id: 8,
      category: 'quality',
      question: 'Vocês têm certificações?',
      answer: 'Sim, somos certificados ISO 9001:2015 para sistemas de gestão da qualidade. Também seguimos normas técnicas específicas conforme o setor de aplicação das peças (automotivo, aeroespacial, médico, etc.).'
    },
    {
      id: 9,
      category: 'process',
      question: 'Como acompanhar o andamento do meu pedido?',
      answer: 'Você pode acompanhar seu pedido através da área do cliente no nosso site. Lá você verá o status em tempo real: orçamento aprovado, em produção, controle de qualidade, expedição. Também enviamos notificações por email e WhatsApp.'
    },
    {
      id: 10,
      category: 'process',
      question: 'Posso fazer alterações no pedido após aprovação?',
      answer: 'Alterações são possíveis dependendo do estágio de produção. Se a peça ainda não entrou em usinagem, podemos fazer ajustes. Caso já tenha iniciado, avaliaremos a viabilidade. Entre em contato conosco o quanto antes para discutir as opções.'
    },
    {
      id: 11,
      category: 'services',
      question: 'Vocês fazem protótipos?',
      answer: 'Sim! Somos especializados em prototipagem rápida. Oferecemos desde protótipos funcionais até peças piloto para testes. Utilizamos tecnologias avançadas para reduzir o tempo de desenvolvimento e validação de produtos.'
    },
    {
      id: 12,
      category: 'pricing',
      question: 'Quais formas de pagamento vocês aceitam?',
      answer: 'Aceitamos diversas formas de pagamento: PIX, transferência bancária, boleto bancário, cartão de crédito (até 12x) e cartão de débito. Para clientes corporativos, oferecemos condições especiais de pagamento a prazo.'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Helmet>
        <title>FAQ - Perguntas Frequentes - Le Torneadora</title>
        <meta name="description" content="Encontre respostas para as principais dúvidas sobre nossos serviços de usinagem e torneamento CNC" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <Breadcrumb.Item>
              <HomeOutlined />
              <span className="ml-1">Início</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>FAQ</Breadcrumb.Item>
          </Breadcrumb>

          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <Title level={1} className="mb-4">
              Perguntas Frequentes
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontre respostas rápidas para as principais dúvidas sobre nossos 
              serviços de usinagem, prazos, qualidade e processos.
            </Paragraph>
          </div>

          {/* Busca */}
          <Card className="mb-6">
            <div className="max-w-md mx-auto">
              <Search
                placeholder="Buscar nas perguntas frequentes..."
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </div>
          </Card>

          <Row gutter={[24, 24]}>
            {/* Filtros por Categoria */}
            <Col xs={24} lg={6}>
              <Card title="Categorias" className="sticky top-4">
                <div className="space-y-2">
                  {categories.map(category => (
                    <Button
                      key={category.key}
                      type={activeCategory === category.key ? 'primary' : 'default'}
                      block
                      icon={category.icon}
                      onClick={() => setActiveCategory(category.key)}
                      className="text-left justify-start"
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>

                <Divider />

                {/* Contato Rápido */}
                <div className="space-y-4">
                  <Title level={5}>Não encontrou sua resposta?</Title>
                  <div className="space-y-2">
                    <Button 
                      block 
                      icon={<PhoneOutlined />}
                      href="tel:+551134567890"
                    >
                      (11) 3456-7890
                    </Button>
                    <Button 
                      block 
                      icon={<WhatsAppOutlined />}
                      href="https://wa.me/5511987654321"
                      target="_blank"
                    >
                      WhatsApp
                    </Button>
                    <Button 
                      block 
                      icon={<MailOutlined />}
                      href="mailto:contato@letorneadora.com.br"
                    >
                      Email
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Lista de FAQs */}
            <Col xs={24} lg={18}>
              <Card>
                {filteredFAQs.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <Text type="secondary">
                        {filteredFAQs.length} pergunta{filteredFAQs.length !== 1 ? 's' : ''} encontrada{filteredFAQs.length !== 1 ? 's' : ''}
                        {activeCategory !== 'all' && (
                          <Tag color="blue" className="ml-2">
                            {categories.find(c => c.key === activeCategory)?.label}
                          </Tag>
                        )}
                      </Text>
                    </div>

                    <Collapse 
                      ghost
                      expandIconPosition="end"
                      className="faq-collapse"
                    >
                      {filteredFAQs.map(faq => (
                        <Panel
                          key={faq.id}
                          header={
                            <div className="flex items-start space-x-3">
                              <QuestionCircleOutlined className="text-blue-500 mt-1" />
                              <Text strong className="text-base">
                                {faq.question}
                              </Text>
                            </div>
                          }
                        >
                          <div className="pl-8">
                            <Paragraph className="text-gray-700 mb-0">
                              {faq.answer}
                            </Paragraph>
                          </div>
                        </Panel>
                      ))}
                    </Collapse>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <QuestionCircleOutlined className="text-6xl text-gray-300 mb-4" />
                    <Title level={3} type="secondary">
                      Nenhuma pergunta encontrada
                    </Title>
                    <Paragraph type="secondary">
                      Tente ajustar sua busca ou escolher uma categoria diferente
                    </Paragraph>
                    <Button 
                      type="primary" 
                      onClick={() => {
                        setSearchTerm('')
                        setActiveCategory('all')
                      }}
                    >
                      Ver Todas as Perguntas
                    </Button>
                  </div>
                )}
              </Card>

              {/* Seção de Contato */}
              <Card className="mt-6">
                <div className="text-center">
                  <Title level={3} className="mb-4">
                    Ainda tem dúvidas?
                  </Title>
                  <Paragraph className="text-lg mb-6">
                    Nossa equipe está pronta para ajudar você com qualquer questão específica
                  </Paragraph>
                  
                  <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={8}>
                      <Link to="/contato">
                        <Button type="primary" size="large" block>
                          Fale Conosco
                        </Button>
                      </Link>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Link to="/produtos">
                        <Button size="large" block>
                          Solicitar Orçamento
                        </Button>
                      </Link>
                    </Col>
                  </Row>

                  <Divider />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <PhoneOutlined className="text-blue-500 mr-2" />
                      <strong>Telefone:</strong><br />
                      (11) 3456-7890
                    </div>
                    <div>
                      <MailOutlined className="text-blue-500 mr-2" />
                      <strong>Email:</strong><br />
                      contato@letorneadora.com.br
                    </div>
                    <div>
                      <ClockCircleOutlined className="text-blue-500 mr-2" />
                      <strong>Horário:</strong><br />
                      Seg-Sex: 8h às 18h
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

export default FAQPage

