import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesController } from './controllers/quotes.controller';
import { QuotesService } from './services/quotes.service';
import { QuoteFactory } from './factories/quote.factory';
import { Quote } from '../entities/quote.entity';
import { QuoteItem } from '../entities/quote-item.entity';
import { Product } from '../entities/product.entity';
import { Profile } from '../entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quote, QuoteItem, Product, Profile]),
  ],
  controllers: [QuotesController],
  providers: [QuotesService, QuoteFactory],
  exports: [QuotesService, QuoteFactory],
})
export class QuotesModule {}

