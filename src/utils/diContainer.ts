import { Database } from '../repositories/database.ts';
import { UserService } from "../services/userService.ts";
import { UserController } from '../controllers/userController.ts';
import { AuditLogRepository } from '../repositories/auditLogRepository.ts';
import { AuditLogService } from '../services/auditLogService.ts';
import { AdminController } from '../controllers/adminController.ts';
import { UserRepository } from '../repositories/userRepository.ts';
import { USE_TEST_DB } from '../environmentVariables.ts';
import { AdminRepository } from '../repositories/adminRepository.ts';
import { AdminService } from '../services/adminService.ts';
import { UserGroupController } from '../controllers/userGroupController.ts';
import { UserGroupService } from '../services/userGroupService.ts';
import { GroupRepository } from '../repositories/groupRepository.ts';
import { GroupService } from '../services/groupService.ts';
import { UserGroupRepository } from '../repositories/userGroupRepository.ts';
import { GroupController } from '../controllers/groupController.ts';

export function initializeDependencies() {
  container.register("Database", Database, [], [USE_TEST_DB], { singleton: true });
  container.register("AdminRepository", AdminRepository, [Database]);
  container.register("UserGroupRepository", UserGroupRepository, [Database]);
  container.register("UserRepository", UserRepository, [Database]);
  container.register("AuditLogRepository", AuditLogRepository, [Database]);
  container.register("GroupRepository", GroupRepository, [Database]);

  container.register("AdminService", AdminService, [AdminRepository]);
  container.register("UserService", UserService, [UserRepository]);
  container.register("AuditLogService", AuditLogService, [AuditLogRepository]);
  container.register("GroupService", GroupService, [GroupRepository]);
  container.register("UserGroupService", UserGroupService, [UserGroupRepository]);

  container.register("AdminController", AdminController, [AdminService]);
  container.register("UserController", UserController, [UserService]);
  container.register("GroupController", GroupController, [GroupService]);
  container.register("UserGroupController", UserGroupController, [UserGroupService]);
}

type Constructor<T> = new (...args: any[]) => T;

class DIContainer {
  private services = new Map<string, any>();

  register<T>(
    token: string,
    service: Constructor<T>,
    dependencies: Constructor<any>[] = [],
    constructorArgs: any[] = [],
    options: { singleton: boolean } = { singleton: false },
  ) {
    if (options.singleton) {
      const resolvedDependencies = dependencies.map(dep => this.resolve(dep.name));
      const instance = new service(...resolvedDependencies, ...constructorArgs);
      this.services.set(token, instance);
    } else {
      this.services.set(token, { service, dependencies, constructorArgs });
    }
  }

  resolve<T>(token: string): T {
    const service = this.services.get(token);

    if (!service) {
      throw new Error(`Service with token "${token}" not registered.`);
    }

    if (typeof service === "object" && service.service) {
      const { service: ServiceConstructor, dependencies, constructorArgs } = service;
      const resolvedDependencies = dependencies.map((dep: any) => this.resolve(dep.name));
      return new ServiceConstructor(...resolvedDependencies, ...constructorArgs);
    }

    return service;
  }
}

export const container = new DIContainer();
