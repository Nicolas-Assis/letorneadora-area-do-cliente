import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Select, 
  Slider, 
  Button, 
  Typography, 
  Space,
  Pagination,
  Spin,
  Empty,
  Breadcrumb,
  Divider,
  Checkbox,
  Tag
} from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  HomeOutlined,
  ClearOutlined
} from '@ant-design/icons'

// Components
import ProductCard from '../components/product/ProductCard'

// Hooks
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name')
  const [viewMode, setViewMode] = useState('grid')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [pageSize] = useState(12)

  // Buscar categorias para filtros
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return data || []
    }
  })

  // Buscar produtos com filtros
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, priceRange, sortBy, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `, { count: 'exact' })
        .eq('is_active', true)

      // Filtro por busca
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
      }

      // Filtro por categoria
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      // Filtro por preço
      query = query.gte('price', priceRange[0]).lte('price', priceRange[1])

      // Ordenação
      switch (sortBy) {
        case 'name':
          query = query.order('name')
          break
        case 'price_asc':
          query = query.order('price', { ascending: true })
          break
        case 'price_desc':
          query = query.order('price', { ascending: false })
          break
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        default:
          query = query.order('name')
      }

      // Paginação
      const from = (currentPage - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        products: data || [],
        total: count || 0
      }
    }
  })

  // Atualizar URL quando filtros mudarem
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    if (sortBy !== 'name') params.set('sort', sortBy)
    if (currentPage > 1) params.set('page', currentPage.toString())
    
    setSearchParams(params)
  }, [searchTerm, selectedCategory, sortBy, currentPage, setSearchParams])

  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (value) => {
    setPriceRange(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setPriceRange([0, 1000])
    setSortBy('name')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000

  const products = productsData?.products || []
  const totalProducts = productsData?.total || 0

  return (
    <>
      <Helmet>
        <title>Produtos - Le Torneadora</title>
        <meta 
          name="description" 
          content="Catálogo completo de produtos da Le Torneadora. Peças torneadas, usinagem CNC e ferramentaria de alta qualidade." 
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <Breadcrumb.Item>
              <HomeOutlined />
              <span className="ml-1">Início</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Produtos</Breadcrumb.Item>
            {selectedCategory && categories && (
              <Breadcrumb.Item>
                {categories.find(c => c.id === selectedCategory)?.name}
              </Breadcrumb.Item>
            )}
          </Breadcrumb>

          {/* Cabeçalho */}
          <div className="mb-8">
            <Title level={1} className="mb-2">
              Nossos Produtos
            </Title>
            <Text type="secondary" className="text-lg">
              Encontre a solução perfeita para suas necessidades de usinagem
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {/* Sidebar de Filtros */}
            <Col xs={24} lg={6}>
              <Card title="Filtros" className="sticky top-4">
                <Space direction="vertical" className="w-full" size="large">
                  {/* Busca */}
                  <div>
                    <Text strong className="block mb-2">Buscar</Text>
                    <Search
                      placeholder="Nome, descrição ou SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onSearch={handleSearch}
                      allowClear
                    />
                  </div>

                  {/* Categoria */}
                  <div>
                    <Text strong className="block mb-2">Categoria</Text>
                    <Select
                      placeholder="Todas as categorias"
                      value={selectedCategory || undefined}
                      onChange={handleCategoryChange}
                      className="w-full"
                      allowClear
                    >
                      {categories?.map(category => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Faixa de Preço */}
                  <div>
                    <Text strong className="block mb-2">
                      Faixa de Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                    </Text>
                    <Slider
                      range
                      min={0}
                      max={1000}
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                      tooltip={{
                        formatter: (value) => `R$ ${value}`
                      }}
                    />
                  </div>

                  {/* Limpar Filtros */}
                  {hasActiveFilters && (
                    <Button 
                      block 
                      icon={<ClearOutlined />}
                      onClick={clearFilters}
                    >
                      Limpar Filtros
                    </Button>
                  )}
                </Space>
              </Card>
            </Col>

            {/* Lista de Produtos */}
            <Col xs={24} lg={18}>
              {/* Barra de Ações */}
              <Card className="mb-6">
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <Text strong>
                        {totalProducts} produto{totalProducts !== 1 ? 's' : ''} encontrado{totalProducts !== 1 ? 's' : ''}
                      </Text>
                      {hasActiveFilters && (
                        <Tag color="blue">
                          <FilterOutlined /> Filtros ativos
                        </Tag>
                      )}
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      {/* Ordenação */}
                      <Select
                        value={sortBy}
                        onChange={handleSortChange}
                        style={{ width: 150 }}
                      >
                        <Option value="name">Nome A-Z</Option>
                        <Option value="price_asc">Menor Preço</Option>
                        <Option value="price_desc">Maior Preço</Option>
                        <Option value="newest">Mais Recentes</Option>
                      </Select>

                      {/* Modo de Visualização */}
                      <Button.Group>
                        <Button
                          type={viewMode === 'grid' ? 'primary' : 'default'}
                          icon={<AppstoreOutlined />}
                          onClick={() => setViewMode('grid')}
                        />
                        <Button
                          type={viewMode === 'list' ? 'primary' : 'default'}
                          icon={<BarsOutlined />}
                          onClick={() => setViewMode('list')}
                        />
                      </Button.Group>
                    </Space>
                  </Col>
                </Row>
              </Card>

              {/* Produtos */}
              {isLoading ? (
                <div className="text-center py-12">
                  <Spin size="large" />
                </div>
              ) : error ? (
                <Card>
                  <div className="text-center py-12">
                    <Text type="danger">Erro ao carregar produtos. Tente novamente.</Text>
                  </div>
                </Card>
              ) : products.length === 0 ? (
                <Card>
                  <Empty
                    description="Nenhum produto encontrado"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button type="primary" onClick={clearFilters}>
                      Ver Todos os Produtos
                    </Button>
                  </Empty>
                </Card>
              ) : (
                <>
                  <Row gutter={[24, 24]}>
                    {products.map(product => (
                      <Col 
                        key={product.id}
                        xs={24} 
                        sm={viewMode === 'grid' ? 12 : 24} 
                        lg={viewMode === 'grid' ? 8 : 24}
                      >
                        <ProductCard product={product} viewMode={viewMode} />
                      </Col>
                    ))}
                  </Row>

                  {/* Paginação */}
                  {totalProducts > pageSize && (
                    <div className="text-center mt-8">
                      <Pagination
                        current={currentPage}
                        total={totalProducts}
                        pageSize={pageSize}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(total, range) => 
                          `${range[0]}-${range[1]} de ${total} produtos`
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default ProductsPage

