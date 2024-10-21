import { AdminRepository } from "../repositories/adminRepository.ts";
import { TableInfoDto } from "../dto/tableInfoDto.ts";

export class AdminService {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  async getAllTables(): Promise<TableInfoDto[]> {
    const tables = await this.adminRepository.getAllTables();
    return tables.map(table => ({ tableName: table }));
  }

  // deno-lint-ignore no-explicit-any
  async getTableData(tableName: string): Promise<any[]> {
    return await this.adminRepository.getTableData(tableName);
  }

  async saveTableData(tableName: string, data: any): Promise<void> {
    await this.adminRepository.saveTableData(tableName, data);
  }

  async deleteTableData(tableName: string, id: number): Promise<void> {
    await this.adminRepository.deleteTableData(tableName, id);
  }
}
