import { Injectable } from '@nestjs/common';
import { Profile } from '../../entities/profile.entity';
import { ProfileDto } from '../dto/profile.dto';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { Role } from '../../auth/enums/role.enum';

@Injectable()
export class ProfileFactory {
  createProfileFromDto(dto: CreateProfileDto): Profile {
    const profile = new Profile();
    
    profile.name = dto.name;
    profile.email = dto.email;
    profile.phone = dto.phone;
    profile.company = dto.company;
    profile.cnpj = dto.cnpj;
    profile.role = dto.role || Role.CLIENT;
    profile.active = true;
    
    return profile;
  }

  toDTO(profile: Profile): ProfileDto {
    const dto = new ProfileDto();
    
    dto.id = profile.id;
    dto.name = profile.name;
    dto.email = profile.email;
    dto.phone = profile.phone;
    dto.company = profile.company;
    dto.cnpj = profile.cnpj;
    dto.role = profile.role;
    dto.active = profile.active;
    dto.createdAt = profile.createdAt;
    dto.updatedAt = profile.updatedAt;

    return dto;
  }

  toDTOList(profiles: Profile[]): ProfileDto[] {
    return profiles.map(profile => this.toDTO(profile));
  }
}

