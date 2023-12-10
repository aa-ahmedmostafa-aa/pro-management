import { ObjectType } from "typeorm";
import { GenericLookupsService } from "./../services/generic-lookups.service";
import { ErrorResponse } from "./../../shared/models/error-response";
import { StatusCodes } from "./../../shared/enums/status-codes";
import { Request, Response } from "express";
import { ResponseHandlingService } from "../../shared/services/response-handling.service";
import { MessageResponse } from "../../shared/models/message-response";

export class GenericLookupController<T> {
  private readonly genericLookupService: GenericLookupsService<T>;
  private readonly lookupName: string;

  constructor(type: ObjectType<T>, lookupName: string) {
    this.genericLookupService = new GenericLookupsService(type);
    this.lookupName = lookupName;
  }

  async getAll(_: Request, res: Response) {
    try {
      return new ResponseHandlingService(
        res,
        await this.genericLookupService.getAll(),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(
          error.message,
          StatusCodes.InternalServerError,
          error
        ),
        StatusCodes.InternalServerError
      );
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const roleInDb = await this.genericLookupService.getOne(id);

      if (!roleInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Can not find ${this.lookupName} with ID: ${id}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      return new ResponseHandlingService(res, roleInDb, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(
          error.message,
          StatusCodes.InternalServerError,
          error
        ),
        StatusCodes.InternalServerError
      );
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newRole = req.body;
      return new ResponseHandlingService(
        res,
        await this.genericLookupService.create(newRole),
        StatusCodes.Created
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(
          error.message,
          StatusCodes.InternalServerError,
          error
        ),
        StatusCodes.InternalServerError
      );
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      let existingLookupInDB = await this.genericLookupService.getOne(id);

      if (!existingLookupInDB) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Can not find ${this.lookupName} with ID: ${id}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      existingLookupInDB = req.body;

      return new ResponseHandlingService(
        res,
        await this.genericLookupService.update(existingLookupInDB),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(
          error.message,
          StatusCodes.InternalServerError,
          error
        ),
        StatusCodes.InternalServerError
      );
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      let existingLookupInDB = await this.genericLookupService.getOne(id);

      if (!existingLookupInDB) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Can not find ${this.lookupName} with ID: ${id}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      existingLookupInDB = req.body;

      await this.genericLookupService.delete(id);

      return new ResponseHandlingService(
        res,
        new MessageResponse(
          `The ${this.lookupName} has been deleted successfully`
        ),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(
          error.message,
          StatusCodes.InternalServerError,
          error
        ),
        StatusCodes.InternalServerError
      );
    }
  }
}
