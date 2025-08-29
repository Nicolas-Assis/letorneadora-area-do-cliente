import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogsService } from '../services/audit-logs.service';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { FilterAuditLogsDto } from '../dto/filter-audit-logs.dto';
import { AuditLogDto } from '../dto/audit-log.dto';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/enums/role.enum';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo log de auditoria' })
  @ApiResponse({
    status: 201,
    description: 'Log de auditoria criado com sucesso',
    type: AuditLogDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async create(@Body() createAuditLogDto: CreateAuditLogDto): Promise<AuditLogDto> {
    return this.auditLogsService.create(createAuditLogDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar logs de auditoria com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs de auditoria recuperada com sucesso',
    type: PaginatedResponseDto<AuditLogDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  async findAll(@Query() filter: FilterAuditLogsDto): Promise<PaginatedResponseDto<AuditLogDto>> {
    return this.auditLogsService.findAll(filter);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter estatísticas de auditoria' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas obtidas com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas ADMIN pode ver estatísticas',
  })
  async getStats(): Promise<any> {
    return this.auditLogsService.getStats();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Buscar log de auditoria por ID' })
  @ApiResponse({
    status: 200,
    description: 'Log de auditoria encontrado',
    type: AuditLogDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Log de auditoria não encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AuditLogDto> {
    return this.auditLogsService.findOneById(id);
  }
}

