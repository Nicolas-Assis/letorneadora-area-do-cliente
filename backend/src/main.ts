import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log('main.ts started - before NestFactory.create()');
async function bootstrap() {
  console.log('main.ts: bootstrap start');

  const app = await NestFactory.create(AppModule);
  console.log('main.ts: NestFactory.create() completed');

  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        },
      },
    }),
  );

  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE', 'Le Torneadora API'))
    .setDescription(
      configService.get('SWAGGER_DESCRIPTION', 'API robusta para o portal do cliente'),
    )
    .setVersion(configService.get('SWAGGER_VERSION', '1.0.0'))
    .addTag('health', 'Health checks')
    .addTag('auth', 'Autenticação e autorização')
    .addTag('profiles', 'Gestão de perfis de usuário')
    .addTag('products', 'Gestão de produtos')
    .addTag('categories', 'Gestão de categorias')
    .addTag('product-images', 'Gestão de imagens de produtos')
    .addTag('inventory', 'Gestão de estoque')
    .addTag('quotes', 'Gestão de orçamentos')
    .addTag('orders', 'Gestão de pedidos')
    .addTag('order-items', 'Itens de pedidos')
    .addTag('tickets', 'Sistema de suporte')
    .addTag('audit-logs', 'Logs de auditoria')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Le Torneadora API Documentation',
  });

  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Le Torneadora API Documentation',
  });

  // Configurar prefixo global (depois do Swagger)
  app.setGlobalPrefix('api/v1');

  // Configurar CORS
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [
    configService.get<string>('CORS_ORIGIN', 'http://localhost:5173'),
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: configService.get('NODE_ENV') === 'production',
    }),
  );

  const port = configService.get('PORT');
  await app.listen(port, '0.0.0.0');
  console.log(`main.ts: app.listen(${port}) returned`);

  const logger = app.get(Logger);
  logger.log(`🚀 Servidor rodando em http://localhost:${port}`);
  logger.log(`📚 Swagger disponível em http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health check disponível em http://localhost:${port}/api/v1/health`);
}

bootstrap();

