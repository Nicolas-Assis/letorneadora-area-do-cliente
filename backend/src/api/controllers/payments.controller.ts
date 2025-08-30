import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Headers,
  RawBody,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AsaasService } from '../../services/asaas.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly asaasService: AsaasService) {}

  @Post('checkout')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar checkout de pagamento' })
  @ApiResponse({
    status: 201,
    description: 'Checkout criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Checkout criado com sucesso' },
        data: {
          type: 'object',
          properties: {
            paymentId: { type: 'string' },
            customerId: { type: 'string' },
            amount: { type: 'number' },
            dueDate: { type: 'string' },
            status: { type: 'string' },
            invoiceUrl: { type: 'string' },
            pixQrCode: { type: 'string' },
            pixCopyPaste: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou erro na criação do checkout',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async createCheckout(
    @Body() checkoutData: {
      customerName: string;
      customerEmail?: string;
      customerCpf?: string;
      customerPhone?: string;
      amount: number;
      description: string;
      externalReference: string;
      dueDate?: string;
    },
    @Request() req,
  ) {
    try {
      // Usar email do usuário autenticado se não fornecido
      const customerEmail = checkoutData.customerEmail || req.user.email;
      
      const checkout = await this.asaasService.createCheckout({
        customerName: checkoutData.customerName,
        customerEmail,
        customerCpf: checkoutData.customerCpf,
        customerPhone: checkoutData.customerPhone,
        amount: checkoutData.amount,
        description: checkoutData.description,
        externalReference: checkoutData.externalReference,
        dueDate: checkoutData.dueDate ? new Date(checkoutData.dueDate) : undefined,
      });

      return {
        success: true,
        message: 'Checkout criado com sucesso',
        data: checkout,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error creating checkout:', error);
      return {
        success: false,
        message: error.message || 'Erro ao criar checkout',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consultar pagamento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Pagamento encontrado' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            value: { type: 'number' },
            description: { type: 'string' },
            dueDate: { type: 'string' },
            paymentDate: { type: 'string' },
            invoiceUrl: { type: 'string' },
            externalReference: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Pagamento não encontrado',
  })
  async getPayment(@Param('id') id: string) {
    try {
      const payment = await this.asaasService.getPayment(id);
      
      return {
        success: true,
        message: 'Pagamento encontrado',
        data: {
          id: payment.id,
          status: payment.status,
          value: payment.value,
          description: payment.description,
          dueDate: payment.dueDate,
          paymentDate: payment.paymentDate,
          invoiceUrl: payment.invoiceUrl,
          externalReference: payment.externalReference,
          billingType: payment.billingType,
          pixTransaction: payment.pixTransaction,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting payment:', error);
      return {
        success: false,
        message: error.message || 'Erro ao consultar pagamento',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly asaasService: AsaasService) {}

  @Post('asaas')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook do Asaas' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Webhook inválido ou erro no processamento',
  })
  async handleAsaasWebhook(
    @Body() body: any,
    @Headers('asaas-signature') signature: string,
    @RawBody() rawBody: Buffer,
  ) {
    try {
      // Validar assinatura do webhook
      const payload = rawBody.toString();
      const isValidSignature = this.asaasService.validateWebhookSignature(payload, signature);
      
      if (!isValidSignature) {
        this.logger.warn('Invalid webhook signature');
        return {
          success: false,
          message: 'Invalid signature',
          timestamp: new Date().toISOString(),
        };
      }

      // Processar evento
      const eventData = this.asaasService.processWebhookEvent(body);
      
      this.logger.log(`Webhook received: ${body.event} for payment ${eventData.paymentId}`);
      
      // Aqui você pode implementar a lógica para atualizar o status do pedido
      // baseado no externalReference e no novo status do pagamento
      
      // TODO: Implementar atualização do status do pedido
      // if (eventData.externalReference) {
      //   await this.ordersService.updatePaymentStatus(
      //     eventData.externalReference,
      //     this.asaasService.mapAsaasStatusToInternal(eventData.status)
      //   );
      // }

      return {
        success: true,
        message: 'Webhook processado com sucesso',
        data: {
          event: body.event,
          paymentId: eventData.paymentId,
          status: eventData.status,
          externalReference: eventData.externalReference,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      return {
        success: false,
        message: 'Erro ao processar webhook',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

