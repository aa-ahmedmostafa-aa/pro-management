import { IFindOptions } from "./../../models/find-options";
import { IFindPaginatedOptions } from "./../../models/find-paginated-options";
import { DeleteResult, UpdateResult } from "typeorm";
import { IRelationFiltrationOptions } from "../../models/relation-filtration-options";

export interface IGenericRepository<T = any> {
  find(findOptions: IFindPaginatedOptions): Promise<Array<T>>;

  findLookup(selectedColumns?: {}): Promise<Array<T>>;

  findQueryBuilder(findOptions: IRelationFiltrationOptions): Promise<T[]>;

  findQueryBuilderAndCount(
    findOptions: IRelationFiltrationOptions
  ): Promise<[T[], number]>;

  findOne(findOptions: IFindOptions): Promise<T>;

  getCount(findOptions: IRelationFiltrationOptions): Promise<number>;

  create(model: T): Promise<T>;

  update(model: T | any): Promise<T>;

  delete(id: number | string): Promise<DeleteResult>;
}
