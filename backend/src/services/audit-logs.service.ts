// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { AuditLog, AuditAction } from '../../entities/audit-log.entity';
// import { Profile } from '../../entities/profile.entity';
// import { CreateAuditLogDto } from '../api/dto/audit-logs/create-audit-log.dto';
// import { FilterAuditLogsDto } from '../api/dto/audit-logs/filter-audit-logs.dto';
// import { AuditLogDto } from '../api/dto/audit-logs/audit-log.dto';
// import { AuditLogFactory } from '../products/factories/audit-log.factory';
// import { PaginatedResponseDto } from '../common/dto/base-response.dto';

// @Injectable()
// export class AuditLogsService {
//   constructor(
//     @InjectRepository(AuditLog)
//     private readonly auditLogRepository: Repository<AuditLog>,
//     @InjectRepository(Profile)
//     private readonly profileRepository: Repository<Profile>,
//     private readonly auditLogFactory: AuditLogFactory,
//   ) {}

//   async create(dto: CreateAuditLogDto): Promise<AuditLogDto> {
//     // Verificar se usuário existe (se fornecido)
//     if (dto.userId) {
//       const user = await this.profileRepository.findOne({
//         where: { id: dto.userId },
//       });

//       if (!user) {
//         throw new NotFoundException('Usuário não encontrado');
//       }
//     }

//     // Criar log de auditoria
//     const auditLog = this.auditLogFactory.createAuditLogFromDto(dto);
//     const savedAuditLog = await this.auditLogRepository.save(auditLog);

//     return this.auditLogFactory.toDTO(savedAuditLog);
//   }

//   async findAll(filter: FilterAuditLogsDto): Promise<PaginatedResponseDto<AuditLogDto>> {
//     const {
//       page = 1,
//       limit = 10,
//       userId,
//       action,
//       entityType,
//       entityId,
//       search,
//       startDate,
//       endDate,
//       ipAddress,
//       includeUser,
//     } = filter;

//     const queryBuilder = this.auditLogRepository.createQueryBuilder('auditLog');

//     // Aplicar filtros
//     if (userId) {
//       queryBuilder.andWhere('auditLog.userId = :userId', { userId });
//     }

//     if (action) {
//       queryBuilder.andWhere('auditLog.action = :action', { action });
//     }

//     if (entityType) {
//       queryBuilder.andWhere('auditLog.entityType = :entityType', { entityType });
//     }

//     if (entityId) {
//       queryBuilder.andWhere('auditLog.entityId = :entityId', { entityId });
//     }

//     if (search) {
//       queryBuilder.andWhere('auditLog.description ILIKE :search', { search: `%${search}%` });
//     }

//     if (startDate) {
//       queryBuilder.andWhere('auditLog.createdAt >= :startDate', { startDate: new Date(startDate) });
//     }

//     if (endDate) {
//       queryBuilder.andWhere('auditLog.createdAt <= :endDate', { endDate: new Date(endDate) });
//     }

//     if (ipAddress) {
//       queryBuilder.andWhere('auditLog.ipAddress = :ipAddress', { ipAddress });
//     }

//     // Incluir relações se solicitado
//     if (includeUser) {
//       queryBuilder.leftJoinAndSelect('auditLog.user', 'user');
//     }

//     // Ordenação
//     const sortField = filter.sort || 'createdAt';
//     const sortOrder = filter.order || 'DESC';
//     queryBuilder.orderBy(`auditLog.${sortField}`, sortOrder);

//     // Paginação
//     const skip = (page - 1) * limit;
//     queryBuilder.skip(skip).take(limit);

//     const [auditLogs, total] = await queryBuilder.getManyAndCount();

//     const auditLogDtos = this.auditLogFactory.toDTOList(auditLogs, includeUser);

//     return new PaginatedResponseDto(
//       true,
//       'Logs de auditoria recuperados com sucesso',
//       auditLogDtos,
//       page,
//       limit,
//       total,
//     );
//   }

//   async findOneById(id: number, includeUser = true): Promise<AuditLogDto> {
//     const queryBuilder = this.auditLogRepository
//       .createQueryBuilder('auditLog')
//       .where('auditLog.id = :id', { id });

//     if (includeUser) {
//       queryBuilder.leftJoinAndSelect('auditLog.user', 'user');
//     }

//     const auditLog = await queryBuilder.getOne();

//     if (!auditLog) {
//       throw new NotFoundException('Log de auditoria não encontrado');
//     }

//     return this.auditLogFactory.toDTO(auditLog, includeUser);
//   }

//   async getStats(): Promise<any> {
//     const total = await this.auditLogRepository.count();

//     const actionStats = await this.auditLogRepository
//       .createQueryBuilder('auditLog')
//       .select('auditLog.action', 'action')
//       .addSelect('COUNT(*)', 'count')
//       .groupBy('auditLog.action')
//       .getRawMany();

//     const entityStats = await this.auditLogRepository
//       .createQueryBuilder('auditLog')
//       .select('auditLog.entityType', 'entityType')
//       .addSelect('COUNT(*)', 'count')
//       .groupBy('auditLog.entityType')
//       .orderBy('COUNT(*)', 'DESC')
//       .limit(10)
//       .getRawMany();

//     const recentActivity = await this.auditLogRepository
//       .createQueryBuilder('auditLog')
//       .leftJoinAndSelect('auditLog.user', 'user')
//       .orderBy('auditLog.createdAt', 'DESC')
//       .limit(10)
//       .getMany();

//     return {
//       total,
//       byAction: actionStats.reduce((acc, stat) => {
//         acc[stat.action] = parseInt(stat.count);
//         return acc;
//       }, {}),
//       byEntityType: entityStats.reduce((acc, stat) => {
//         acc[stat.entityType] = parseInt(stat.count);
//         return acc;
//       }, {}),
//       recentActivity: this.auditLogFactory.toDTOList(recentActivity, true),
//     };
//   }

//   // Métodos de conveniência para criar logs específicos
//   async logCreate(
//     entityType: string,
//     entityId: string,
//     description: string,
//     newValues: any,
//     userId?: string,
//     ipAddress?: string,
//     userAgent?: string,
//   ): Promise<void> {
//     await this.create({
//       userId,
//       action: AuditAction.CREATE,
//       entityType,
//       entityId,
//       description,
//       newValues,
//       ipAddress,
//       userAgent,
//     });
//   }

//   async logUpdate(
//     entityType: string,
//     entityId: string,
//     description: string,
//     oldValues: any,
//     newValues: any,
//     userId?: string,
//     ipAddress?: string,
//     userAgent?: string,
//   ): Promise<void> {
//     await this.create({
//       userId,
//       action: AuditAction.UPDATE,
//       entityType,
//       entityId,
//       description,
//       oldValues,
//       newValues,
//       ipAddress,
//       userAgent,
//     });
//   }

//   async logDelete(
//     entityType: string,
//     entityId: string,
//     description: string,
//     oldValues: any,
//     userId?: string,
//     ipAddress?: string,
//     userAgent?: string,
//   ): Promise<void> {
//     await this.create({
//       userId,
//       action: AuditAction.DELETE,
//       entityType,
//       entityId,
//       description,
//       oldValues,
//       ipAddress,
//       userAgent,
//     });
//   }

//   async logLogin(
//     userId: string,
//     description: string,
//     ipAddress?: string,
//     userAgent?: string,
//   ): Promise<void> {
//     await this.create({
//       userId,
//       action: AuditAction.LOGIN,
//       entityType: 'User',
//       entityId: userId,
//       description,
//       ipAddress,
//       userAgent,
//     });
//   }

//   async logLogout(
//     userId: string,
//     description: string,
//     ipAddress?: string,
//     userAgent?: string,
//   ): Promise<void> {
//     await this.create({
//       userId,
//       action: AuditAction.LOGOUT,
//       entityType: 'User',
//       entityId: userId,
//       description,
//       ipAddress,
//       userAgent,
//     });
//   }
// }
