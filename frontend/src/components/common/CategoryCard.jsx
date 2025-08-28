import { Link } from 'react-router-dom'
import { Card, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'

const { Meta } = Card
const { Text } = Typography

const CategoryCard = ({ category }) => {
  const imageUrl = category.image_url || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop'

  return (
    <Link to={`/categoria/${category.slug}`}>
      <Card
        hoverable
        className="h-full"
        cover={
          <div className="relative overflow-hidden h-40">
            <img
              alt={category.name}
              src={imageUrl}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
              <div className="flex items-center text-sm opacity-90">
                <span>Ver produtos</span>
                <ArrowRightOutlined className="ml-2" />
              </div>
            </div>
          </div>
        }
      >
        <Meta
          description={
            <Text type="secondary" className="text-sm">
              {category.description || 'Explore nossa linha completa de produtos nesta categoria.'}
            </Text>
          }
        />
      </Card>
    </Link>
  )
}

export default CategoryCard

