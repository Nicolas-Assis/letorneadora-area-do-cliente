import { Injectable } from '@nestjs/common';
import { AuditLog } from '../../entities/audit-log.entity';
import { AuditLogDto, UserSummaryDto } from '../dto/audit-log.dto';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';

@Injectable()
export class AuditLogFactory {
  createAuditLogFromDto(dto: CreateAuditLogDto): AuditLog {
    const auditLog = new AuditLog();
    
    auditLog.userId = dto.userId;
    auditLog.action = dto.action;
    auditLog.entityType = dto.entityType;
    auditLog.entityId = dto.entityId;
    auditLog.description = dto.description;
    auditLog.oldValues = dto.oldValues;
    auditLog.newValues = dto.newValues;
    auditLog.ipAddress = dto.ipAddress;
    auditLog.userAgent = dto.userAgent;
    
    return auditLog;
  }

  toDTO(auditLog: AuditLog, includeUser = false): AuditLogDto {
    const dto = new AuditLogDto();
    
    dto.id = auditLog.id;
    dto.userId = auditLog.userId;
    dto.action = auditLog.action;
    dto.entityType = auditLog.entityType;
    dto.entityId = auditLog.entityId;
    dto.description = auditLog.description;
    dto.oldValues = auditLog.oldValues;
    dto.newValues = auditLog.newValues;
    dto.ipAddress = auditLog.ipAddress;
    dto.userAgent = auditLog.userAgent;
    dto.createdAt = auditLog.createdAt;

    if (includeUser && auditLog.user) {
      dto.user = {
        id: auditLog.user.id,
        name: auditLog.user.name,
        email: auditLog.user.email,
      } as UserSummaryDto;
    }

    return dto;
  }

  toDTOList(auditLogs: AuditLog[], includeUser = false): AuditLogDto[] {
    return auditLogs.map(auditLog => this.toDTO(auditLog, includeUser));
  }
}

