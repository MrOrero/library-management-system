import { Global, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Config } from "src/config/configuration";
import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { UnitOfWork } from "./UnitOfWork";
import { UNIT_OF_WORK_PROVIDER } from "../constants";
import * as path from "path";

interface WriteConnection {
  readonly startTransaction: (
    level?:
      | "READ UNCOMMITTED"
      | "READ COMMITTED"
      | "REPEATABLE READ"
      | "SERIALIZABLE"
  ) => Promise<void>;
  readonly commitTransaction: () => Promise<void>;
  readonly rollbackTransaction: () => Promise<void>;
  readonly release: () => Promise<void>;
  readonly isTransactionActive: boolean;
  readonly manager: EntityManager;
}

interface ReadConnection {
  readonly getRepository: <T extends ObjectLiteral>(
    target: EntityTarget<T>
  ) => Repository<T>;
  readonly query: (query: string) => Promise<void>;
  readonly createQueryBuilder: <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner
  ) => SelectQueryBuilder<Entity>;
}

export let writeConnection = {} as WriteConnection;
export let readConnection = {} as ReadConnection;

class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly dataSource = new DataSource({
    type: "postgres",
    entities: [
    ], //path.join(__dirname, "..", "**", "*.model.{js,ts}")
    migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")],
    logging: Config.DATABASE_LOGGING,
    host: Config.DATABASE_HOST,
    port: Config.DATABASE_PORT,
    database: Config.DATABASE_NAME,
    username: Config.DATABASE_USER,
    password: Config.DATABASE_PASSWORD,
    synchronize: false,
    extra: {
      trustServerCertificate: true,
    },
  });

  async onModuleInit(): Promise<void> {
    await this.dataSource.initialize();
    if (!this.dataSource.isInitialized)
      throw new Error("DataSource is not initialized");
    writeConnection = this.dataSource.createQueryRunner();
    readConnection = this.dataSource.manager;
    console.log("Database connection established");
  }

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: UNIT_OF_WORK_PROVIDER,
      useClass: UnitOfWork,
    },
  ],
  exports: [UNIT_OF_WORK_PROVIDER],
})
export class DatabaseModule {}
