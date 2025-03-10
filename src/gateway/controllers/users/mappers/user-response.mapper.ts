import { User } from '@/domain/entities/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserResponseMapper {
  static toDTO(user: User): UserResponseDto {
    const dto = new UserResponseDto();

    dto.id = user.id;
    dto.email = user.email;
    dto.fullName = user.fullName;
    dto.roles = user.roles;
    dto.isActive = user.isActive;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;

    // La contraseña y el refreshToken nunca se mapean al DTO

    return dto;
  }

  static toDTOList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toDTO(user));
  }
}
