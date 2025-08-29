import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from '../src/app.module';

async function exportOpenAPI() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Le Torneadora API')
    .setDescription('API robusta para o portal do cliente')
    .setVersion('1.0.0')
    .addServer('/api/v1', 'API v1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  
  console.log('✅ OpenAPI spec exported to openapi.json');
  
  await app.close();
}

exportOpenAPI().catch((error) => {
  console.error('❌ Error exporting OpenAPI spec:', error);
  process.exit(1);
});

