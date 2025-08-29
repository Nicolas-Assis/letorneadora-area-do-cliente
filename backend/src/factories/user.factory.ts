import { Injectable } from '@nestjs/common';
import { Users } from '../api/entities/user.entity';
import { UserDto } from '../api/dto/User/user.dto';
import { CreateUserDto } from '../api/dto/User/create-user.dto';
// import { Role } from '../../auth/enums/role.enum';

@Injectable()
export class UserFactory {
  createUserFromDto(dto: CreateUserDto): Users {
    const user = new Users();

    user.name = dto.name;
    // user.email = dto.email;
    user.phone = dto.phone ?? '';
    return user;
  }

  toDTO(user: Users): UserDto {
    const dto = new UserDto();

//    dto.id = user.id;
    dto.name = user.name;
    // dto.email = user.email;
    dto.phone = user.phone;
    dto.createdAt = user.createdAt;
//    dto.updatedAt = user.updatedAt;

    return dto;
  }

  toDTOList(users: Users[]): UserDto[] {
    return users.map((user) => this.toDTO(user));
  }
}
