import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Space,
  Carousel,
  Statistic,
  Divider
} from 'antd'
import {
  RocketOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
  PhoneOutlined
} from '@ant-design/icons'

// Components
import ProductCard from '../components/product/ProductCard'
import CategoryCard from '../components/common/CategoryCard'

// Hooks
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const { Title, Paragraph } = Typography

const HomePage = () => {
  // Buscar produtos em destaque
  const { data: featuredProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8)

      if (error) throw error
      return data || []
    }
  })

  // Buscar categorias principais
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['main-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .is('parent_id', null)
        .order('sort_order')
        .limit(6)

      if (error) throw error
      return data || []
    }
  })

  return (
    <>
      <Helmet>
        <title>Le Torneadora - Usinagem de Precisão e Peças Torneadas</title>
        <meta 
          name="description" 
          content="Especialista em usinagem de precisão, peças torneadas, CNC e ferramentaria. Qualidade garantida e entrega rápida. Solicite seu orçamento online." 
        />
        <meta 
          name="keywords" 
          content="usinagem, tornearia, peças torneadas, CNC, ferramentaria, precisão, São Paulo" 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <div className="space-y-6">
                <Title level={1} className="text-white text-4xl lg:text-5xl font-bold leading-tight">
                  Usinagem de Precisão para sua Indústria
                </Title>
                <Paragraph className="text-blue-100 text-lg leading-relaxed">
                  Especialistas em peças torneadas, usinagem CNC e ferramentaria. 
                  Mais de 20 anos de experiência garantindo qualidade e pontualidade 
                  para sua empresa.
                </Paragraph>
                <Space size="large" wrap>
                  <Button 
                    type="primary" 
                    size="large" 
                    className="bg-white text-blue-600 border-white hover:bg-gray-100"
                  >
                    <Link to="/produtos">
                      Ver Produtos
                    </Link>
                  </Button>
                  <Button 
                    size="large" 
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                    icon={<PhoneOutlined />}
                  >
                    <Link to="/contato">
                      Solicitar Orçamento
                    </Link>
                  </Button>
                </Space>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop" 
                  alt="Usinagem de precisão" 
                  className="rounded-lg shadow-2xl w-full max-w-md mx-auto"
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]} justify="center">
            <Col xs={12} sm={6}>
              <div className="text-center">
                <Statistic 
                  title="Anos de Experiência" 
                  value={20} 
                  suffix="+"
                  valueStyle={{ color: '#1890ff', fontSize: '2.5rem', fontWeight: 'bold' }}
                />
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center">
                <Statistic 
                  title="Clientes Atendidos" 
                  value={500} 
                  suffix="+"
                  valueStyle={{ color: '#1890ff', fontSize: '2.5rem', fontWeight: 'bold' }}
                />
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center">
                <Statistic 
                  title="Projetos Concluídos" 
                  value={2000} 
                  suffix="+"
                  valueStyle={{ color: '#1890ff', fontSize: '2.5rem', fontWeight: 'bold' }}
                />
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center">
                <Statistic 
                  title="Satisfação do Cliente" 
                  value={98} 
                  suffix="%"
                  valueStyle={{ color: '#1890ff', fontSize: '2.5rem', fontWeight: 'bold' }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Nossos Diferenciais */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="text-3xl font-bold mb-4">
              Por que escolher a Le Torneadora?
            </Title>
            <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto">
              Combinamos tecnologia de ponta com expertise técnica para entregar 
              soluções de usinagem que superam expectativas.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-blue-500 text-4xl mb-4">
                  <RocketOutlined />
                </div>
                <Title level={4}>Tecnologia Avançada</Title>
                <Paragraph className="text-gray-600">
                  Equipamentos CNC de última geração para máxima precisão e qualidade.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-green-500 text-4xl mb-4">
                  <SafetyOutlined />
                </div>
                <Title level={4}>Qualidade Garantida</Title>
                <Paragraph className="text-gray-600">
                  Controle rigoroso de qualidade em todas as etapas do processo produtivo.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-orange-500 text-4xl mb-4">
                  <ClockCircleOutlined />
                </div>
                <Title level={4}>Entrega Rápida</Title>
                <Paragraph className="text-gray-600">
                  Prazos cumpridos rigorosamente para não atrasar seus projetos.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-purple-500 text-4xl mb-4">
                  <TrophyOutlined />
                </div>
                <Title level={4}>Experiência Comprovada</Title>
                <Paragraph className="text-gray-600">
                  Mais de 20 anos atendendo os mais diversos segmentos industriais.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Categorias de Produtos */}
      {categories && categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Title level={2} className="text-3xl font-bold mb-4">
                Nossas Especialidades
              </Title>
              <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto">
                Oferecemos soluções completas em usinagem para diversos segmentos industriais.
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {categories.map(category => (
                <Col xs={24} sm={12} lg={8} key={category.id}>
                  <CategoryCard category={category} />
                </Col>
              ))}
            </Row>

            <div className="text-center mt-8">
              <Button type="primary" size="large">
                <Link to="/produtos">
                  Ver Todos os Produtos
                  <ArrowRightOutlined />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Produtos em Destaque */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Title level={2} className="text-3xl font-bold mb-4">
                Produtos em Destaque
              </Title>
              <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto">
                Conheça alguns dos nossos produtos mais procurados pelos clientes.
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {featuredProducts.slice(0, 4).map(product => (
                <Col xs={24} sm={12} lg={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            <div className="text-center mt-8">
              <Button type="primary" size="large">
                <Link to="/produtos">
                  Ver Mais Produtos
                  <ArrowRightOutlined />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Title level={2} className="text-white text-3xl font-bold mb-4">
            Precisa de uma Peça Especial?
          </Title>
          <Paragraph className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para desenvolver soluções personalizadas 
            para suas necessidades específicas. Solicite um orçamento sem compromisso.
          </Paragraph>
          <Space size="large" wrap>
            <Button 
              type="primary" 
              size="large" 
              className="bg-white text-blue-600 border-white hover:bg-gray-100"
            >
              <Link to="/contato">
                Solicitar Orçamento
              </Link>
            </Button>
            <Button 
              size="large" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              icon={<PhoneOutlined />}
            >
              (11) 3456-7890
            </Button>
          </Space>
        </div>
      </section>
    </>
  )
}

export default HomePage

