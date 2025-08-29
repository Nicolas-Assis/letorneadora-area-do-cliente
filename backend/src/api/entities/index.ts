//import { Adresses } from './adresses.entity';
import { AuditLog } from './audit-log.entity';
import { Category } from './category.entity';
import { Inventory } from './inventory.entity';
import { OrderItem } from './order-item.entity';
import { ProductCategory } from './product-category.entity';
import { ProductImage } from './product-image.entity';
import { Product } from './product.entity';
import { QuoteItem } from './quote-item.entity';
//import { QuoteStatus } from './quote.entity';
import { TicketMessage } from './ticket-message.entity';
import { Users } from './user.entity';
import { Warehouse } from './warehouse.entity';

const entities = [
  AuditLog,
  Category,
  Inventory,
  OrderItem,
  ProductCategory,
  ProductImage,
  Product,
  QuoteItem,
  // QuoteStatus,
  TicketMessage,
  Users,
  Warehouse,
  Adresses,
];

export default entities;
