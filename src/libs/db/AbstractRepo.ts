import {
  EntityTarget,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { BaseEntity } from "./BaseEntity";
import { readConnection, writeConnection } from "./DatabaseModule";
import { NotFoundException } from "@nestjs/common";
import { CREATED_AT_COLUMN, PaginatedQuery } from "../constants";

export abstract class AbstractRepo<T extends BaseEntity> {
  constructor(private readonly entityTarget: EntityTarget<T>) {}

  async save(entity: T): Promise<T> {
    return writeConnection.manager
      .getRepository(this.entityTarget)
      .save(entity);
  }

  async exists(where: FindOptionsWhere<T>) {
    const res = await readConnection
      .getRepository(this.entityTarget)
      .findOne({ where });

    return !!res === true;
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>
  ): Promise<T> {
    const entity = await readConnection
      .getRepository(this.entityTarget)
      .findOne({ where, relations });

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ) {
    const updateResult = await writeConnection.manager
      .getRepository(this.entityTarget)
      .update(where, partialEntity);

    if (!updateResult.affected) {
      console.warn("Entity not found with where", where);
      throw new NotFoundException("Entity not found.");
    }

    return this.findOne(where);
  }

  async updateMany(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ) {
    const updateResult = await writeConnection.manager
      .getRepository(this.entityTarget)
      .update(where, partialEntity);

    return updateResult;
  }

  async findPaginated(
    {page, size, filter, filterBy, order, orderBy}: PaginatedQuery,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    orderParam?: FindOptionsOrder<T>,
    relations?: FindOptionsRelations<T>
  ) {
    size = size ? size : 10;
    page = page ? page : 1;
    const offset = (page - 1) * size;

    const orderRelation = {
      [orderBy ? orderBy : CREATED_AT_COLUMN]: order ? order : 'DESC' 
    } as FindOptionsOrder<T>;

    if (filter && filterBy) {
      where = {
        ...where,
        [filterBy]: filter,
      };
    }

    const res = await readConnection
      .getRepository(this.entityTarget)
      .findAndCount({
        take: size,
        skip: offset,
        where,
        order : {
          ...orderParam,
          ...orderRelation
        
        },
        relations,
      });

    const [data, total] = res;

    return {
      data,
      pagination: {
        total,
        size,
        page,
      },
    };
  }

  async find(where: FindOptionsWhere<T>, order: FindOptionsOrder<T> = {}) {
    return readConnection.getRepository(this.entityTarget).find({
      where,
      order,
    });
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    const res = await writeConnection.manager
      .getRepository(this.entityTarget)
      .delete(where);

    return {
      status: !!res.affected,
    };
  }

  async search(
    keyword: string,
    columns: string[],
    entityName: string,
    pageSize: number = 10,
    currentPage: number = 1,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[] | Record<string, any>,
    relations?: string
  ) {
    try {
      const queryBuilder = readConnection
        .getRepository(this.entityTarget)
        .createQueryBuilder(entityName);

      const whereConditions = columns.map(
        (column) => `${entityName}.${column} LIKE :term`
      );
      const offset = (currentPage - 1) * pageSize;

      queryBuilder.where(`(${whereConditions.join(" OR ")})`, {
        term: `%${keyword}%`,
      });

      if (where) {
        if (Array.isArray(where)) {
          where.forEach((condition) => {
            queryBuilder.orWhere(`(${this.buildConditionString(condition)})`, {
              ...condition,
            });
          });
        } else {
          queryBuilder.andWhere(`(${this.buildConditionString(where)})`, {
            ...where,
          });
        }
      }

      
     if (relations) {
       queryBuilder.leftJoinAndSelect(`${entityName}.${relations}`, relations);
     }
      // const [data, total] = await queryBuilder
      //   .take(pageSize)
      //   .skip(offset)
      //   .leftJoinAndSelect("templateFolderId", "folder");
      //   .getManyAndCount();

      const data = await queryBuilder.take(pageSize).skip(offset).getMany();

      const total = await queryBuilder.getCount();

      return {
        data,
        pagination: {
          total,
          pageSize,
          currentPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  buildConditionString(condition: FindOptionsWhere<T>): string {
    const conditions = Object.keys(condition).map((key) => `${key} = :${key}`);
    console.log("conditions", conditions);
    return conditions.join(" AND ");
  }

  async count(options?: FindManyOptions<T>) {
    try {
      const res = await readConnection
        .getRepository(this.entityTarget)
        .count(options);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
