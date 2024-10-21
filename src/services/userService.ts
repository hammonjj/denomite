import type { CreateUserDto } from '../dto/createUserDto.ts';
import type { UserDto } from '../dto/UserDto.ts';
import { UserRepository } from "../repositories/userRepository.ts";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  getAllUsers(): UserDto[] {
    return this.userRepository.getAllUsers();
  }

  getUserById(id: number): UserDto | null {
    return this.userRepository.getUserById(id);
  }

  createUser(userData: CreateUserDto): Promise<UserDto> {
    return this.userRepository.createUser(userData);
  }

  deleteUser(id: number) {
    this.userRepository.deleteUser(id);
  }
}
