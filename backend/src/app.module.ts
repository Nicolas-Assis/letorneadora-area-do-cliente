import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LoggerModule } from 'nestjs-pino';

import { ApiModule } from './api/api.module';
// import { FirebaseModule } from './api/auth/firebase/firebase.module';
import { ServiceModule } from './services/service.module';
import entities from './api/entities';
// import configs, { Database } from './configs';
// import { PgListenerService } from './pg-listener.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // garante leitura do .env na raiz do backend
      // load: [configs],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        // logs temporários
        console.log('process.cwd():', process.cwd());
        console.log('env DATABASE_URL:', process.env.DATABASE_URL);

        // prefer DATABASE_URL when set
        const dbUrl = configService.get<string>('DATABASE_URL') ?? process.env.DATABASE_URL;
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            synchronize: false,
            autoLoadEntities: true,
            logging: true,
            ssl: false,
            entities,
          };
        }

        // use individual vars
        const host = configService.get<string>('DATABASE_HOST') ?? process.env.DATABASE_HOST ?? '';
        const port = Number(
          configService.get<number>('DATABASE_PORT') ?? process.env.DATABASE_PORT ?? 5432,
        );
        const username =
          configService.get<string>('DATABASE_USERNAME') ?? process.env.DATABASE_USERNAME;
        const password =
          configService.get<string>('DATABASE_PASSWORD') ?? process.env.DATABASE_PASSWORD;
        const databaseName =
          configService.get<string>('DATABASE_NAME') ?? process.env.DATABASE_NAME;

        console.log(
          'TypeOrm useFactory - host, user, passwordPresent:',
          host,
          username,
          !!password,
        );

        return {
          type: 'postgres',
          host,
          port,
          username,
          password: password as any, // ensure string
          database: databaseName,
          synchronize: false,
          autoLoadEntities: true,
          logging: true,
          ssl: false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          extra: { retryAttempts: 3, timezone: 'Z' },
        };
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: () => uuidv4().toString(),
        name: 'le-torneadora-api',
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        formatters: {
          level: (label) => ({ level: label }),
        },
        redact: ['req.headers.authorization', 'req.headers.cookie'],
      },
    }),
    // FirebaseModule,
    ServiceModule,
    ApiModule,
  ],
  controllers: [],
  // providers: [ApiModule, PgListenerService],
  exports: [],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    // este construtor é executado durante a bootstrap dos módulos
    this.logger.log('AppModule.constructor');
  }

  onModuleInit() {
    this.logger.log('AppModule.onModuleInit');
  }
}
