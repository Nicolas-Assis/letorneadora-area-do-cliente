import { Injectable } from '@nestjs/common';
//import { Quote, QuoteStatus } from '../api/entities/quote.entity';
import { QuoteItem } from '../api/entities/quote-item.entity';
import {
  QuoteDto,
  QuoteItemDto,
  ProfileSummaryDto,
  ProductSummaryDto,
} from '../api/dto/quote/quote.dto';
import { CreateQuoteDto, CreateQuoteItemDto } from '../api/dto/quote/create-quote.dto';

@Injectable()
export class QuoteFactory {
  createQuoteFromDto(dto: CreateQuoteDto): Quote {
    const quote = new Quote();

//    quote.profileId = dto.profileId;
    quote.status = QuoteStatus.DRAFT;
    quote.notes = dto.notes;

    if (dto.validUntil) {
//      quote.validUntil = new Date(dto.validUntil);
    }

    return quote;
  }

  createQuoteItemFromDto(dto: CreateQuoteItemDto, quoteId: number): QuoteItem {
    const quoteItem = new QuoteItem();

//    quoteItem.quoteId = quoteId;
//    quoteItem.productId = dto.productId;
    quoteItem.quantity = dto.quantity;
    // quoteItem.unitPrice = dto.unitPrice;

    return quoteItem;
  }

  toDTO(quote: Quote, includeRelations = false): QuoteDto {
    const dto = new QuoteDto();

    dto.id = quote.id;
//    dto.profileId = quote.profileId;
//    dto.status = quote.status;
//    dto.total = quote.total;
    dto.notes = quote.notes;
//    dto.validUntil = quote.validUntil;
    dto.createdAt = quote.createdAt;
    dto.updatedAt = quote.updatedAt;

    if (includeRelations) {
      // Incluir dados do cliente se existir
      if (quote.profile) {
        dto.profile = {
          id: quote.profile.id,
          name: quote.profile.name,
          phone: quote.profile.phone,
        } as ProfileSummaryDto;
      }

      // Incluir itens se existirem
      // if (quote.quoteItems && quote.quoteItems.length > 0) {
      //   dto.items = quote.quoteItems.map((item) => this.quoteItemToDTO(item));
      // }
    }

    return dto;
  }

  quoteItemToDTO(quoteItem: QuoteItem): QuoteItemDto {
    const dto = new QuoteItemDto();

    dto.id = quoteItem.id;
//    dto.productId = quoteItem.productId;
    dto.quantity = quoteItem.quantity;
    // dto.unitPrice = quoteItem.unitPrice;

    // Calcular subtotal se preço unitário estiver disponível
    // if (quoteItem.unitPrice) {
    //   dto.subtotal = quoteItem.quantity * quoteItem.unitPrice;
    // }

    // Incluir dados do produto se existir
    if (quoteItem.product) {
      dto.product = {
        id: quoteItem.product.id,
        name: quoteItem.product.name,
        slug: quoteItem.product.slug,
      } as ProductSummaryDto;
    }

    return dto;
  }

  toDTOList(quotes: Quote[], includeRelations = false): QuoteDto[] {
    return quotes.map((quote) => this.toDTO(quote, includeRelations));
  }

  calculateTotal(quoteItems: QuoteItem[]): number {
    return quoteItems.reduce((total, item) => {
      // if (item.unitPrice) {
      //   return total + item.quantity * item.unitPrice;
      // }
      return total;
    }, 0);
  }
}
