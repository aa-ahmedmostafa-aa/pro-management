import { StatusCodes } from "../enums/status-codes";
import { Response } from "express";

export class ResponseHandlingService {
  private res!: Response;
  private data!: any;
  private statusCode!: StatusCodes;

  constructor(res: Response, data: any, statusCode: StatusCodes) {
    this.res = res;
    this.data = data;
    this.statusCode = statusCode;

    this.handleApiResponse();
  }

  private handleApiResponse(): Response {
    return this.res.status(this.statusCode).json(this.data);
  }
}
