import { SSQLTable } from 'smallormSqlite';

export class UserGroupModel extends SSQLTable {
  userId!: number;
  groupId!: number;
}