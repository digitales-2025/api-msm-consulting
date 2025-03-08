import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.create(createUserDto);

    const userResponse: UserResponseDto = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return userResponse;
  }
}
