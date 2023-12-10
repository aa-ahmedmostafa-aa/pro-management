import { Request } from "express";
import { IPaginatedRequest } from "../models/paginated-request";
import { PaginatedResponse } from "../models/paginated-response";
import config from "../../../config";

export class PaginationUtils {
  public static getPaginatedResponse<T>(
    pageNumber: number,
    pageSize: number,
    data: Array<T>,
    dataLength?: number
  ): PaginatedResponse<T> {
    return {
      pageNumber,
      pageSize,
      data,
      totalNumberOfRecords: dataLength || data.length,
      totalNumberOfPages: this.calculateTotalNumberOfPages(
        dataLength || data.length,
        pageSize
      ),
    };
  }

  public static getPaginationRequirementsFromRequest(
    req: Request
  ): IPaginatedRequest {
    return {
      pageNumber:
        parseInt(req.query.pageNumber as string) || config.DEFAULT_PAGE_NUMBER,
      pageSize:
        parseInt(req.query.pageSize as string) || config.DEFAULT_PAGE_SIZE,
    };
  }

  private static calculateTotalNumberOfPages(
    recordsLength: number,
    pageSize: number
  ): number {
    const totalNumberOfPages = Math.ceil(recordsLength / pageSize);

    return totalNumberOfPages > 1 ? totalNumberOfPages : 1;
  }
}
