import { SSQLTable } from "smallormSqlite";
import { hashPassword } from "../utils/hashPassword.ts";

export class UserModel extends SSQLTable {
  name!: string;
  email!: string;
  password!: string;

  async setPassword(plainPassword: string) {
    this.password = await hashPassword(plainPassword);
  }
}
