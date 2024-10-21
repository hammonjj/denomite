import { Database } from "./database.ts";
import { UserModel } from "../models/userModel.ts";
import type { CreateUserDto } from '../dto/createUserDto.ts';

export class UserRepository {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }
  
  async getAllUsers() {
    return await this.db.query("users");
  }

  async getUserById(id: string) {
    return this.db.query("SELECT * FROM users WHERE id = ?", [id]);
  }

  async createUser(userData: CreateUserDto) {
    return this.db.query("INSERT INTO users (name, email) VALUES (?, ?)", [userData.name, userData.email]);
  }
}
