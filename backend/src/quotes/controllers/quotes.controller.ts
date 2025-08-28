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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QuotesService } from '../services/quotes.service';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { UpdateQuoteDto } from '../dto/update-quote.dto';
import { FilterQuotesDto } from '../dto/filter-quotes.dto';
import { QuoteDto } from '../dto/quote.dto';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/enums/role.enum';

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo orçamento' })
  @ApiResponse({
    status: 201,
    description: 'Orçamento criado com sucesso',
    type: QuoteDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou produtos não encontrados',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil do cliente não encontrado',
  })
  async create(@Body() createQuoteDto: CreateQuoteDto): Promise<QuoteDto> {
    return this.quotesService.create(createQuoteDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar orçamentos com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de orçamentos recuperada com sucesso',
    type: PaginatedResponseDto<QuoteDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async findAll(@Query() filter: FilterQuotesDto): Promise<PaginatedResponseDto<QuoteDto>> {
    return this.quotesService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Buscar orçamento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Orçamento encontrado',
    type: QuoteDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Orçamento não encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<QuoteDto> {
    return this.quotesService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar orçamento' })
  @ApiResponse({
    status: 200,
    description: 'Orçamento atualizado com sucesso',
    type: QuoteDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou orçamento não pode ser alterado',
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
    description: 'Orçamento não encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ): Promise<QuoteDto> {
    return this.quotesService.update(id, updateQuoteDto);
  }

  @Patch(':id/submit')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enviar orçamento para análise' })
  @ApiResponse({
    status: 200,
    description: 'Orçamento enviado para análise',
    type: QuoteDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Orçamento não pode ser enviado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Orçamento não encontrado',
  })
  async submit(@Param('id', ParseIntPipe) id: number): Promise<QuoteDto> {
    return this.quotesService.submit(id);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Aprovar orçamento' })
  @ApiResponse({
    status: 200,
    description: 'Orçamento aprovado com sucesso',
    type: QuoteDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Orçamento não pode ser aprovado',
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
    description: 'Orçamento não encontrado',
  })
  async approve(@Param('id', ParseIntPipe) id: number): Promise<QuoteDto> {
    return this.quotesService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Rejeitar orçamento' })
  @ApiResponse({
    status: 200,
    description: 'Orçamento rejeitado',
    type: QuoteDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Orçamento não pode ser rejeitado',
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
    description: 'Orçamento não encontrado',
  })
  async reject(@Param('id', ParseIntPipe) id: number): Promise<QuoteDto> {
    return this.quotesService.reject(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover orçamento' })
  @ApiResponse({
    status: 200,
    description: 'Orçamento removido com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Orçamento aprovado não pode ser removido',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas ADMIN pode remover orçamentos',
  })
  @ApiResponse({
    status: 404,
    description: 'Orçamento não encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.quotesService.remove(id);
  }
}

