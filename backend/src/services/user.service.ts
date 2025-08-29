import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users} from '../api/entities/user.entity';
import { CreateUserDto } from '../api/dto/User/create-user.dto';
import { UpdateUserDto } from '../api/dto/User/update-user.dto';
// import { FilterUsersDto } from '../api/dto/User/filter-user.dto';
import { UserDto } from '../api/dto/User/user.dto';
import { UserFactory } from '../factories/user.factory';
// import { PaginatedResponseDto } from '../../common/dto/base-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly profileRepository: Repository<Users>,
    private readonly UserFactory: UserFactory,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    // Verificar se email já existe
    // const existingProfile = await this.profileRepository.findOne({
    //   // where: { email: dto.email },
    // });

    // if (existingProfile) {
    //   throw new ConflictException('Email já está em uso');
    // }

    // Criar usuário
    const user = this.UserFactory.createUserFromDto(dto);
    const savedUser = await this.profileRepository.save(user);

    return this.UserFactory.toDTO(savedUser);
  }

  // async findAll(filter: FilterProfilesDto): Promise<PaginatedResponseDto<UserDto>> {
  //   const { page = 1, limit = 10, role, active, search, company } = filter;

  //   const queryBuilder = this.profileRepository.createQueryBuilder('user');

  //   // Aplicar filtros
  //   if (role) {
  //     queryBuilder.andWhere('user.role = :role', { role });
  //   }

  //   if (active !== undefined) {
  //     queryBuilder.andWhere('user.active = :active', { active });
  //   }

  //   if (search) {
  //     queryBuilder.andWhere(
  //       '(user.name ILIKE :search OR user.email ILIKE :search OR user.company ILIKE :search)',
  //       { search: `%${search}%` },
  //     );
  //   }

  //   if (company) {
  //     queryBuilder.andWhere('user.company ILIKE :company', { company: `%${company}%` });
  //   }

  //   // Ordenação
  //   const sortField = filter.sort || 'createdAt';
  //   const sortOrder = filter.order || 'DESC';
  //   queryBuilder.orderBy(`user.${sortField}`, sortOrder);

  //   // Paginação
  //   const skip = (page - 1) * limit;
  //   queryBuilder.skip(skip).take(limit);

  //   const [profiles, total] = await queryBuilder.getManyAndCount();

  //   const profileDtos = this.UserFactory.toDTOList(profiles);

  //   return new PaginatedResponseDto(
  //     true,
  //     'Perfis recuperados com sucesso',
  //     profileDtos,
  //     page,
  //     limit,
  //     total,
  //   );
  // }

  async findOneById(id: string): Promise<UserDto> {
//    const user = await this.profileRepository.findOne({ where: { id } });

    // if (!users) {
    //   throw new NotFoundException('Perfil não encontrado');
    // }

    // return this.UserFactory.toDTO(user);
  }

  // async findOneByEmail(email: string): Promise<UserDto | null> {
  //   // const user = await this.profileRepository.findOne({ where: { email } });

  //   if (!user) {
  //     return null;
  // }

  //   return this.UserFactory.toDTO(user);
  // }

  async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
//    const user = await this.profileRepository.findOne({ where: { id } });

    // if (!user) {
    //   throw new NotFoundException('Usuário não encontrado');
    // }

    // Verificar se email já existe (se está sendo alterado)
    // if (dto.email && dto.email !== user.email) {
    //   const existingProfile = await this.profileRepository.findOne({
    //     where: { email: dto.email },
    //   });

    //   if (existingProfile) {
    //     throw new ConflictException('Email já está em uso');
    //   }
    // }

    // // Atualizar campos
    // if (dto.name !== undefined) {
    //   user.name = dto.name;
    // }

    // if (dto.email !== undefined) {
    //   // user.email = dto.email;
    // }

    // if (dto.phone !== undefined) {
    //   user.phone = dto.phone;
    // }

    // const updatedProfile = await this.profileRepository.save(user);

    return this.UserFactory.toDTO(updatedProfile);
  }

  // async activate(id: string): Promise<UserDto> {
  //   const user = await this.profileRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException('Perfil não encontrado');
  //   }

  // user.active = true;
  // const updatedProfile = await this.profileRepository.save(user);

  // async deactivate(id: string): Promise<UserDto> {
  //   const user = await this.profileRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException('Perfil não encontrado');
  //   }

  //   // user.active = false;
  //   // const updatedProfile = await this.profileRepository.save(user);

  //   return this.UserFactory.toDTO(updatedProfile);
  // }

  async remove(id: string): Promise<void> {
//    const user = await this.profileRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException('Perfil não encontrado');
  //   }

  //   await this.profileRepository.remove(user);
  // }
  }
  async getStats(): Promise<any> {
    const total = await this.profileRepository.count();
    // const active = await this.profileRepository.count({ where: { active: true } });
    // const inactive = total - active;

    const roleStats = await this.profileRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    return {
      total,
      // active,
      // inactive,
      byRole: roleStats.reduce((acc, stat) => {
        acc[stat.role] = parseInt(stat.count);
        return acc;
      }, {}),
    };
  }
}
