import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Configurar prefixo global
    app.setGlobalPrefix('api/v1');
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/products (GET)', () => {
    it('should return paginated products', () => {
//      return request(app.getHttpServer())
//        .get('/api/v1/products')
//        .expect(200)
//        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should filter products by search term', () => {
//      return request(app.getHttpServer())
//        .get('/api/v1/products?search=test')
//        .expect(200)
//        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should paginate products correctly', () => {
//      return request(app.getHttpServer())
//        .get('/api/v1/products?page=1&limit=5')
//        .expect(200)
//        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('meta');
          expect(res.body.meta).toHaveProperty('page', 1);
          expect(res.body.meta).toHaveProperty('limit', 5);
        });
//    });
//  });

  describe('/api/v1/products (POST)', () => {
    const createProductDto = {
      name: 'Produto Teste E2E',
      description: 'Descrição do produto teste',
      price: 99.99,
      productionTime: 5,
      active: true,
    };

    it('should create a new product', () => {
//      return request(app.getHttpServer())
//        .post('/api/v1/products')
//        .send(createProductDto)
//        .expect(201)
//        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('name', createProductDto.name);
          expect(res.body.data).toHaveProperty('price', createProductDto.price);
        });
    });

    it('should validate required fields', () => {
//      return request(app.getHttpServer())
//        .post('/api/v1/products')
//        .send({})
//        .expect(400)
//        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
        });
    });

    it('should validate price is positive', () => {
//      return request(app.getHttpServer())
//        .post('/api/v1/products')
//        .send({
//          ...createProductDto,
//          price: -10,
//        })
//        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
        });
    });
//  });

  describe('/api/v1/products/:id (GET)', () => {
    it('should return 404 for non-existent product', () => {
//      return request(app.getHttpServer())
//        .get('/api/v1/products/999999')
//        .expect(404)
//        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
        });
    });
  });

  describe('/api/v1/products/:id (PATCH)', () => {
    const updateProductDto = {
      name: 'Produto Atualizado',
      price: 149.99,
    };

    it('should return 404 for non-existent product', () => {
//      return request(app.getHttpServer())
//        .patch('/api/v1/products/999999')
//        .send(updateProductDto)
//        .expect(404)
//        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
        });
    });
  });

  describe('/api/v1/products/:id (DELETE)', () => {
    it('should return 404 for non-existent product', () => {
//      return request(app.getHttpServer())
//        .delete('/api/v1/products/999999')
//        .expect(404)
//        .expect((res) => {
          expect(res.body).toHaveProperty('success', false);
        });
    });
//  });
//});

