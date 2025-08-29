// import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Client } from 'pg';
// import { Database } from './configs';
// import { PinoLogger } from 'nestjs-pino';

// @Injectable()
// export class PgListenerService implements OnModuleInit, OnApplicationShutdown {
//   private client: Client | undefined;
//   private readonly channel = 'update_report_status_view_channel';
//   private isRefreshing = false;
//   private reconnecting = false;
//   private reconnectionDelay = 5000;

//   constructor(private configService: ConfigService, private readonly logger: PinoLogger) {
//     console.log('PgListenerService.constructor'); // <-- log temporário
//   }

//   async onModuleInit() {
//     console.log('PgListenerService.onModuleInit'); // <-- log temporário
//     await this.connectToPostgres();
//   }

//   async onApplicationShutdown() {
//     await this.disconnect();
//   }

//   async connectToPostgres() {
//     const database = this.configService.get<Database>('database');
//     this.client = new Client({
//       connectionString: database?.url,
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     });

//     try {
//       await this.client.connect();
//       this.logger.info('[Postgres] Conectado com sucesso.');

//       this.client.on('error', (err: Error) => {
//         this.logger.error(err, '[Postgres] Erro na conexão.');
//         this.handleReconnection();
//       });

//       this.client.on('end', () => {
//         this.logger.warn('[Postgres] Conexão encerrada.');
//         this.handleReconnection();
//       });

//       await this.client.query(`LISTEN ${this.channel}`);
//       this.logger.info(`[Postgres] Escutando canal: ${this.channel}`);

//       this.client.on('notification', (msg: { payload?: string }) => {
//         try {
//           const payload = JSON.parse(msg.payload || '{}');
//           this.logger.info({ payload }, '📣 Notificação recebida');
//           this.refreshMaterializedView();
//         } catch (err) {
//           this.logger.error(err, 'Erro ao processar notificação');
//         }
//       });
//     } catch (err) {
//       this.logger.error(err, '[Postgres] Falha ao conectar. Tentando novamente...');
//       this.handleReconnection();
//     }
//   }

//   private async handleReconnection() {
//     if (this.reconnecting) return;

//     this.reconnecting = true;
//     this.logger.info(`Tentando reconexão ao Postgres em ${this.reconnectionDelay / 1000}s...`);

//     setTimeout(async () => {
//       try {
//         await this.disconnect(); // fecha conexão antiga se necessário
//         await this.connectToPostgres();
//         this.reconnecting = false;
//         //atualizar a view sempre que a conexão for recriada
//         this.refreshMaterializedView();
//       } catch (err) {
//         this.logger.error(err, '[Postgres] Erro ao reconectar. Tentando novamente...');
//         this.handleReconnection();
//       }
//     }, this.reconnectionDelay);
//   }

//   private async disconnect() {
//     if (this.client) {
//       try {
//         await this.client.end();
//         this.logger.info('[Postgres] Conexão encerrada com sucesso.');
//       } catch (err) {
//         this.logger.warn(err, '[Postgres] Erro ao encerrar conexão.');
//       }
//     }
//   }

//   private async refreshMaterializedView() {
//     if (this.isRefreshing) {
//       this.logger.info('Já há uma atualização em andamento. Ignorando...');
//       return;
//     }
//     this.isRefreshing = true;
//     this.logger.info('Atualizando materialized view...');

//     try {
//       if (this.client) {
//         await this.client.query('REFRESH MATERIALIZED VIEW CONCURRENTLY report_status_view;');
//         this.logger.info('Materialized view atualizada com sucesso.');
//       } else {
//         this.logger.warn(
//           'Não é possível atualizar a materialized view: client não está conectado.',
//         );
//       }
//     } catch (err) {
//       this.logger.error('Erro ao atualizar materialized view:', err);
//     } finally {
//       this.isRefreshing = false;
//     }
//   }
// }
