import { UserRepository } from "../repositories/userRepository.ts";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: string) {
    return this.userRepository.getUserById(id);
  }

  async createUser(userData: any) {
    return this.userRepository.createUser(userData);
  }
}
