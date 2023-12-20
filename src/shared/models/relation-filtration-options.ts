import { IFindPaginatedOptions } from "./find-paginated-options";
import { IRelationProperties } from "./relation";

export interface IRelationFiltrationOptions extends IFindPaginatedOptions {
    queryBuilderCreationPropertyName: string;
    tableRelations?: IRelationProperties[];
    tableRelationsAndSelect?: IRelationProperties[];
    relationFiltration?: string[];
    orderBy?: {}
}