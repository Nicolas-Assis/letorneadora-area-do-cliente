import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from '../services/tickets.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { AddMessageDto } from '../dto/add-message.dto';
import { FilterTicketsDto } from '../dto/filter-tickets.dto';
import { TicketDto, TicketMessageDto } from '../dto/ticket.dto';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/enums/role.enum';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo ticket' })
  @ApiResponse({
    status: 201,
    description: 'Ticket criado com sucesso',
    type: TicketDto,
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
    status: 404,
    description: 'Perfil do cliente não encontrado',
  })
  async create(@Body() createTicketDto: CreateTicketDto): Promise<TicketDto> {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar tickets com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tickets recuperada com sucesso',
    type: PaginatedResponseDto<TicketDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async findAll(@Query() filter: FilterTicketsDto): Promise<PaginatedResponseDto<TicketDto>> {
    return this.ticketsService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Buscar ticket por ID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket encontrado',
    type: TicketDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket não encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TicketDto> {
    return this.ticketsService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar ticket' })
  @ApiResponse({
    status: 200,
    description: 'Ticket atualizado com sucesso',
    type: TicketDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou ticket não pode ser alterado',
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
    description: 'Ticket não encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<TicketDto> {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Post(':id/messages')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Adicionar mensagem ao ticket' })
  @ApiResponse({
    status: 201,
    description: 'Mensagem adicionada com sucesso',
    type: TicketMessageDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ticket fechado ou dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket ou autor não encontrado',
  })
  async addMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() addMessageDto: AddMessageDto,
    @Request() req: any,
  ): Promise<TicketMessageDto> {
    // TODO: Extrair authorId do token JWT quando implementado
    const authorId = req.user?.id || 'temp-user-id';
    return this.ticketsService.addMessage(id, addMessageDto, authorId);
  }

  @Patch(':id/assign/:userId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atribuir ticket a um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Ticket atribuído com sucesso',
    type: TicketDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ticket fechado não pode ser atribuído',
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
    description: 'Ticket ou usuário não encontrado',
  })
  async assign(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
  ): Promise<TicketDto> {
    return this.ticketsService.assign(id, userId);
  }

  @Patch(':id/resolve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Marcar ticket como resolvido' })
  @ApiResponse({
    status: 200,
    description: 'Ticket marcado como resolvido',
    type: TicketDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ticket fechado não pode ser resolvido',
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
    description: 'Ticket não encontrado',
  })
  async resolve(@Param('id', ParseIntPipe) id: number): Promise<TicketDto> {
    return this.ticketsService.resolve(id);
  }

  @Patch(':id/close')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Fechar ticket' })
  @ApiResponse({
    status: 200,
    description: 'Ticket fechado com sucesso',
    type: TicketDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ticket já está fechado',
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
    description: 'Ticket não encontrado',
  })
  async close(@Param('id', ParseIntPipe) id: number): Promise<TicketDto> {
    return this.ticketsService.close(id);
  }

  @Patch(':id/reopen')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reabrir ticket' })
  @ApiResponse({
    status: 200,
    description: 'Ticket reaberto com sucesso',
    type: TicketDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Apenas tickets fechados ou resolvidos podem ser reabertos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket não encontrado',
  })
  async reopen(@Param('id', ParseIntPipe) id: number): Promise<TicketDto> {
    return this.ticketsService.reopen(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover ticket' })
  @ApiResponse({
    status: 200,
    description: 'Ticket removido com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas ADMIN pode remover tickets',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket não encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ticketsService.remove(id);
  }
}

