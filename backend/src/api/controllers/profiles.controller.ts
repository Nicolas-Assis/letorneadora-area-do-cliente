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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../../services/user.service';
import { CreateUserDto } from '../dto/User/create-user.dto';
import { UpdateUserDto } from '../dto/User/update-user.dto';
import { FilterUsersDto } from '../dto/User/filter-user.dto';
import { UserDto } from '../dto/User/user.dto';
// import { PaginatedResponseDto } from '../../common/dto/base-response.dto';
// import { Roles } from '../../auth/decorators/roles.decorator';
// import { RolesGuard } from '../../auth/guards/roles.guard';
// import { Role } from '../../auth/enums/role.enum';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: UsersService) {}

  @Post()
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo perfil' })
  @ApiResponse({
    status: 201,
    description: 'Perfil criado com sucesso',
    type: UserDto,
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
    description: 'Acesso negado - apenas ADMIN pode criar perfis',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.profilesService.create(createUserDto);
  }

  @Get()
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar perfis com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfis recuperada com sucesso',
    // type: PaginatedResponseDto<ProfileDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  // async findAll(@Query() filter: FilterProfilesDto): Promise<PaginatedResponseDto<ProfileDto>> {
  //   return this.profilesService.findAll(filter);
  // }
  @Get('stats')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter estatísticas de perfis' })
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
    return this.profilesService.getStats();
  }

  @Get(':id')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Buscar perfil por ID' })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado',
    type: UserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return this.profilesService.findOneById(id);
  }

  @Patch(':id')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN, Role.OPERATOR, Role.CLIENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar perfil' })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso',
    type: UserDto,
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
    description: 'Perfil não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    return this.profilesService.update(id, updateUserDto);
  }

  @Patch(':id/activate')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Ativar perfil' })
  @ApiResponse({
    status: 200,
    description: 'Perfil ativado com sucesso',
    type: UserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas ADMIN pode ativar perfis',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil não encontrado',
  })
  // async activate(@Param('id') id: string): Promise<UserDto> {
  //   return this.profilesService.activate(id);
  // }
  @Patch(':id/deactivate')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Desativar perfil' })
  @ApiResponse({
    status: 200,
    description: 'Perfil desativado com sucesso',
    type: UserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas ADMIN pode desativar perfis',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil não encontrado',
  })
  // async deactivate(@Param('id') id: string): Promise<ProfileDto> {
  //   return this.profilesService.deactivate(id);
  // }
  @Delete(':id')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover perfil' })
  @ApiResponse({
    status: 200,
    description: 'Perfil removido com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas ADMIN pode remover perfis',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil não encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.profilesService.remove(id);
  }
}
