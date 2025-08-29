import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsController } from './controllers/audit-logs.controller';
import { AuditLogsService } from './services/audit-logs.service';
import { AuditLogFactory } from './factories/audit-log.factory';
import { AuditLog } from '../entities/audit-log.entity';
import { Profile } from '../entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, Profile]),
  ],
  controllers: [AuditLogsController],
  providers: [AuditLogsService, AuditLogFactory],
  exports: [AuditLogsService, AuditLogFactory],
})
export class AuditLogsModule {}

