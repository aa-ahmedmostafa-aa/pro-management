import { IFindOptions } from "./find-options";

export interface IFindPaginatedOptions extends IFindOptions {
    skip?: number,
    take?: number
}