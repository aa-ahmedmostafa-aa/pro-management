export interface PaginatedResponse<T> {
    pageNumber: number;
    pageSize: number;
    data: Array<T>;
    totalNumberOfPages: number;
    totalNumberOfRecords: number;
}