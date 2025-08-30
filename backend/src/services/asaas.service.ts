import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';

export interface AsaasCustomer {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface AsaasPayment {
  customer: string; // customer ID
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  value: number;
  dueDate: string; // YYYY-MM-DD
  description?: string;
  externalReference?: string;
  installmentCount?: number;
  installmentValue?: number;
  discount?: {
    value: number;
    dueDateLimitDays: number;
  };
  interest?: {
    value: number;
  };
  fine?: {
    value: number;
  };
}

export interface AsaasWebhookEvent {
  event: string;
  payment: {
    object: string;
    id: string;
    dateCreated: string;
    customer: string;
    paymentLink?: string;
    value: number;
    netValue: number;
    originalValue?: number;
    interestValue?: number;
    description?: string;
    billingType: string;
    status: string;
    pixTransaction?: any;
    confirmedDate?: string;
    paymentDate?: string;
    clientPaymentDate?: string;
    installmentNumber?: number;
    invoiceUrl?: string;
    invoiceNumber?: string;
    externalReference?: string;
    deleted: boolean;
    anticipated: boolean;
    anticipable: boolean;
  };
}

@Injectable()
export class AsaasService {
  private readonly logger = new Logger(AsaasService.name);
  private readonly apiClient: AxiosInstance;
  private readonly apiKey: string;
  private readonly environment: string;
  private readonly webhookSecret: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('ASAAS_API_KEY');
    this.environment = this.config.get<string>('ASAAS_ENV', 'sandbox');
    this.webhookSecret = this.config.get<string>('ASAAS_WEBHOOK_SECRET');

    if (!this.apiKey) {
      throw new Error('ASAAS_API_KEY is required');
    }

    const baseURL = this.environment === 'production' 
      ? 'https://www.asaas.com/api/v3'
      : 'https://sandbox.asaas.com/api/v3';

    this.apiClient = axios.create({
      baseURL,
      headers: {
        'access_token': this.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.logger.log(`Asaas service initialized in ${this.environment} mode`);
  }

  async createCustomer(customerData: AsaasCustomer): Promise<any> {
    try {
      const response = await this.apiClient.post('/customers', customerData);
      this.logger.debug(`Customer created: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create customer:', error.response?.data || error.message);
      throw new BadRequestException('Erro ao criar cliente no Asaas');
    }
  }

  async createPayment(paymentData: AsaasPayment): Promise<any> {
    try {
      const response = await this.apiClient.post('/payments', paymentData);
      this.logger.debug(`Payment created: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create payment:', error.response?.data || error.message);
      throw new BadRequestException('Erro ao criar cobrança no Asaas');
    }
  }

  async getPayment(paymentId: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get payment:', error.response?.data || error.message);
      throw new BadRequestException('Erro ao consultar cobrança no Asaas');
    }
  }

  async createCheckout(orderData: {
    customerName: string;
    customerEmail: string;
    customerCpf?: string;
    customerPhone?: string;
    amount: number;
    description: string;
    externalReference: string;
    dueDate?: Date;
  }): Promise<any> {
    try {
      // Primeiro, criar ou buscar cliente
      const customer = await this.createCustomer({
        name: orderData.customerName,
        email: orderData.customerEmail,
        cpfCnpj: orderData.customerCpf,
        phone: orderData.customerPhone,
      });

      // Criar cobrança
      const dueDate = orderData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
      const payment = await this.createPayment({
        customer: customer.id,
        billingType: 'PIX',
        value: orderData.amount,
        dueDate: dueDate.toISOString().split('T')[0],
        description: orderData.description,
        externalReference: orderData.externalReference,
      });

      return {
        paymentId: payment.id,
        customerId: customer.id,
        amount: payment.value,
        dueDate: payment.dueDate,
        status: payment.status,
        invoiceUrl: payment.invoiceUrl,
        pixQrCode: payment.pixTransaction?.qrCode,
        pixCopyPaste: payment.pixTransaction?.payload,
      };
    } catch (error) {
      this.logger.error('Failed to create checkout:', error);
      throw error;
    }
  }

  validateWebhookSignature(payload: string, signature: string): boolean {
    if (!this.webhookSecret) {
      this.logger.warn('ASAAS_WEBHOOK_SECRET not configured, skipping signature validation');
      return true; // Em desenvolvimento, pode pular validação
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      this.logger.error('Error validating webhook signature:', error);
      return false;
    }
  }

  processWebhookEvent(event: AsaasWebhookEvent): {
    paymentId: string;
    status: string;
    externalReference?: string;
    paidAmount?: number;
    paidDate?: string;
  } {
    const payment = event.payment;
    
    return {
      paymentId: payment.id,
      status: payment.status,
      externalReference: payment.externalReference,
      paidAmount: payment.value,
      paidDate: payment.paymentDate || payment.confirmedDate,
    };
  }

  // Mapear status do Asaas para status interno
  mapAsaasStatusToInternal(asaasStatus: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'pending',
      'RECEIVED': 'paid',
      'CONFIRMED': 'paid',
      'OVERDUE': 'overdue',
      'REFUNDED': 'refunded',
      'RECEIVED_IN_CASH': 'paid',
      'REFUND_REQUESTED': 'refund_requested',
      'CHARGEBACK_REQUESTED': 'chargeback_requested',
      'CHARGEBACK_DISPUTE': 'chargeback_dispute',
      'AWAITING_CHARGEBACK_REVERSAL': 'awaiting_chargeback_reversal',
      'DUNNING_REQUESTED': 'dunning_requested',
      'DUNNING_RECEIVED': 'dunning_received',
      'AWAITING_RISK_ANALYSIS': 'awaiting_risk_analysis',
    };

    return statusMap[asaasStatus] || 'unknown';
  }
}

