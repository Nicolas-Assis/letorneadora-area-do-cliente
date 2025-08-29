import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile.entity';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { FilterProfilesDto } from '../dto/filter-profiles.dto';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileFactory } from '../factories/profile.factory';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly profileFactory: ProfileFactory,
  ) {}

  async create(dto: CreateProfileDto): Promise<ProfileDto> {
    // Verificar se email já existe
    const existingProfile = await this.profileRepository.findOne({
      where: { email: dto.email },
    });

    if (existingProfile) {
      throw new ConflictException('Email já está em uso');
    }

    // Criar perfil
    const profile = this.profileFactory.createProfileFromDto(dto);
    const savedProfile = await this.profileRepository.save(profile);

    return this.profileFactory.toDTO(savedProfile);
  }

  async findAll(filter: FilterProfilesDto): Promise<PaginatedResponseDto<ProfileDto>> {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      active, 
      search,
      company 
    } = filter;

    const queryBuilder = this.profileRepository.createQueryBuilder('profile');

    // Aplicar filtros
    if (role) {
      queryBuilder.andWhere('profile.role = :role', { role });
    }

    if (active !== undefined) {
      queryBuilder.andWhere('profile.active = :active', { active });
    }

    if (search) {
      queryBuilder.andWhere(
        '(profile.name ILIKE :search OR profile.email ILIKE :search OR profile.company ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (company) {
      queryBuilder.andWhere('profile.company ILIKE :company', { company: `%${company}%` });
    }

    // Ordenação
    const sortField = filter.sort || 'createdAt';
    const sortOrder = filter.order || 'DESC';
    queryBuilder.orderBy(`profile.${sortField}`, sortOrder);

    // Paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [profiles, total] = await queryBuilder.getManyAndCount();

    const profileDtos = this.profileFactory.toDTOList(profiles);

    return new PaginatedResponseDto(
      true,
      'Perfis recuperados com sucesso',
      profileDtos,
      page,
      limit,
      total,
    );
  }

  async findOneById(id: string): Promise<ProfileDto> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return this.profileFactory.toDTO(profile);
  }

  async findOneByEmail(email: string): Promise<ProfileDto | null> {
    const profile = await this.profileRepository.findOne({ where: { email } });

    if (!profile) {
      return null;
    }

    return this.profileFactory.toDTO(profile);
  }

  async update(id: string, dto: UpdateProfileDto): Promise<ProfileDto> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    // Verificar se email já existe (se está sendo alterado)
    if (dto.email && dto.email !== profile.email) {
      const existingProfile = await this.profileRepository.findOne({
        where: { email: dto.email },
      });

      if (existingProfile) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Atualizar campos
    if (dto.name !== undefined) {
      profile.name = dto.name;
    }

    if (dto.email !== undefined) {
      profile.email = dto.email;
    }

    if (dto.phone !== undefined) {
      profile.phone = dto.phone;
    }

    if (dto.company !== undefined) {
      profile.company = dto.company;
    }

    if (dto.cnpj !== undefined) {
      profile.cnpj = dto.cnpj;
    }

    if (dto.role !== undefined) {
      profile.role = dto.role;
    }

    if (dto.active !== undefined) {
      profile.active = dto.active;
    }

    const updatedProfile = await this.profileRepository.save(profile);

    return this.profileFactory.toDTO(updatedProfile);
  }

  async activate(id: string): Promise<ProfileDto> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    profile.active = true;
    const updatedProfile = await this.profileRepository.save(profile);

    return this.profileFactory.toDTO(updatedProfile);
  }

  async deactivate(id: string): Promise<ProfileDto> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    profile.active = false;
    const updatedProfile = await this.profileRepository.save(profile);

    return this.profileFactory.toDTO(updatedProfile);
  }

  async remove(id: string): Promise<void> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    await this.profileRepository.remove(profile);
  }

  async getStats(): Promise<any> {
    const total = await this.profileRepository.count();
    const active = await this.profileRepository.count({ where: { active: true } });
    const inactive = total - active;

    const roleStats = await this.profileRepository
      .createQueryBuilder('profile')
      .select('profile.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('profile.role')
      .getRawMany();

    return {
      total,
      active,
      inactive,
      byRole: roleStats.reduce((acc, stat) => {
        acc[stat.role] = parseInt(stat.count);
        return acc;
      }, {}),
    };
  }
}

