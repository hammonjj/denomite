import { Database } from '../repositories/database.ts';
import { UserService } from "../services/userService.ts";
import { UserController } from '../controllers/userController.ts';
import { AuditLogRepository } from '../repositories/auditLogRepository.ts';
import { AuditLogService } from '../services/auditLogService.ts';
import { AdminController } from '../controllers/adminController.ts';
import { UserRepository } from '../repositories/userRepository.ts';
import { USE_TEST_DB } from '../environmentVariables.ts';

// Initialize the DI container
export function initializeDependencies() {
  container.register("Database", Database, [], [USE_TEST_DB], { singleton: true });
  container.register("UserRepository", UserRepository, [Database]);
  container.register("UserService", UserService, [UserRepository]);
  container.register("UserController", UserController, [UserService]);
  container.register("AuditLogRepository", AuditLogRepository, [Database]);
  container.register("AuditLogService", AuditLogService, [AuditLogRepository]);
  container.register("AdminController", AdminController, [AuditLogService, UserService]);
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
