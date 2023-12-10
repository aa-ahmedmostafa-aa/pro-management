import { IFindPaginatedOptions } from "./../../models/find-paginated-options";
import { DeleteResult, ObjectType, Raw, Repository } from "typeorm";
import { DB } from "../../../config/db";
import { IFindOptions } from "../../models/find-options";
import { IGenericRepository } from "./../abstractions/generic-repository";
import { IRelationFiltrationOptions } from "../../models/relation-filtration-options";

export class GenericRepository<T> implements IGenericRepository<T> {
  private type: ObjectType<T>;
  private readonly dbRepository: Repository<any>;

  constructor(type: ObjectType<T>) {
    this.type = type;
    this.dbRepository = DB.getRepository(this.type);
  }

  findOne(findOptions: IFindOptions): Promise<T> {
    return this.dbRepository.findOne({
      relations: findOptions.relations,
      where: findOptions.where,
      select: findOptions.selectedColumns,
    });
  }

  find(findOptions: IFindPaginatedOptions): Promise<T[]> {
    return this.dbRepository.find({
      relations: findOptions.relations,
      where: findOptions.where,
      skip: findOptions.skip,
      take: findOptions.take,
      order: findOptions.order,
    });
  }

  findLookup(selectedColumns?: {}): Promise<Array<T>> {
    return this.dbRepository.find({
      select: selectedColumns,
    });
  }

  findQueryBuilder(findOptions: IRelationFiltrationOptions): Promise<T[]> {
    let query = this.dbRepository.createQueryBuilder(
      findOptions.queryBuilderCreationPropertyName
    );

    findOptions.tableRelations.forEach((element) => {
      query = query.leftJoinAndSelect(
        element.navigationPropertyName,
        element.selector
      );
    });

    if (findOptions.where) query = query.where(findOptions.where);

    if (findOptions.relationFiltration)
      findOptions.relationFiltration.forEach((element) => {
        query = query.andWhere(element);
      });
    if (findOptions.orderBy) query.orderBy(findOptions.orderBy);

    return query.skip(findOptions.skip).take(findOptions.take).getMany();
  }

  findQueryBuilderAndCount(
    findOptions: IRelationFiltrationOptions
  ): Promise<[T[], number]> {
    let query = this.dbRepository.createQueryBuilder(
      findOptions.queryBuilderCreationPropertyName
    );

    findOptions.tableRelations.forEach((element) => {
      query = query.leftJoinAndSelect(
        element.navigationPropertyName,
        element.selector
      );
    });

    if (findOptions.where) query = query.where(findOptions.where);

    if (findOptions.relationFiltration)
      findOptions.relationFiltration.forEach((element) => {
        query = query.andWhere(element);
      });

    if (findOptions.orderBy) query.orderBy(findOptions.orderBy);
    return query
      .skip(findOptions.skip)
      .take(findOptions.take)
      .getManyAndCount();
  }

  getCount(findOptions: IRelationFiltrationOptions) {
    let query = this.dbRepository.createQueryBuilder(
      findOptions.queryBuilderCreationPropertyName
    );

    findOptions.tableRelations.forEach((element) => {
      query = query.leftJoinAndSelect(
        element.navigationPropertyName,
        element.selector
      );
    });

    if (findOptions.where) query = query.where(findOptions.where);

    if (findOptions.relationFiltration)
      findOptions.relationFiltration.forEach((element) => {
        query = query.andWhere(element);
      });

    return query.getCount();
  }

  create(model: T): Promise<T> {
    return this.dbRepository.save(model);
  }

  update(model: T | any): Promise<T> {
    return this.dbRepository.save(model);
  }

  delete(id: string | number): Promise<DeleteResult> {
    return this.dbRepository.delete(id);
  }
}
