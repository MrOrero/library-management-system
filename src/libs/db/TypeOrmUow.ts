import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, EntityTarget, Repository } from 'typeorm';
import { IUnitOfWork } from './IUnitOfWork';

@Injectable()
export class TypeOrmUow implements IUnitOfWork {
  isTransactionActive: boolean;

  manager: EntityManager;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.isTransactionActive =
      dataSource.createQueryRunner().isTransactionActive;

    this.manager = dataSource.createQueryRunner().manager;
  }

  public async startTransaction(
    level?:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
  ): Promise<void> {
    level
      ? await this.dataSource.createQueryRunner().startTransaction(level)
      : await this.dataSource.createQueryRunner().startTransaction();
  }

  public async commitTransaction(): Promise<void> {
    await this.dataSource.createQueryRunner().commitTransaction();
  }

  public async rollbackTransaction(): Promise<void> {
    await this.dataSource.createQueryRunner().rollbackTransaction();
  }

  public getRepository<T>(target: EntityTarget<T>): Repository<T> {
    return this.dataSource.manager.getRepository(target);
  }

  async complete(work: () => void) {
    try {
      await work();
      await this.commitTransaction();
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    } finally {
      await this.dataSource.createQueryRunner().release();
    }
  }
}
