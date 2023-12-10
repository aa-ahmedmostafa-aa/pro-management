import { AddOrUpdateUserGroupDto } from "./models/add-or-update-user-group.dto";
import { MessageResponse } from "./../../shared/models/message-response";
import { ErrorResponse } from "./../../shared/models/error-response";
import { Request, Response } from "express";
import { StatusCodes } from "../../shared/enums/status-codes";
import { ResponseHandlingService } from "../../shared/services/response-handling.service";
import { UserGroupsService } from "./user-group.service";
import { UserGroups } from "../../shared/models/user-groups";

export class UserGroupsController {
  private readonly userGroupsService: UserGroupsService;

  constructor() {
    this.userGroupsService = new UserGroupsService();
  }

  async getAllGroups(res: Response) {
    try {

      const groups = await this.userGroupsService.getAllGroups();

      return new ResponseHandlingService(res, groups, StatusCodes.OK);
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

  async getGroup(req: Request, res: Response) {
    try {
      const groupId = parseInt(req.params.id);

      const groupInDb = await this.userGroupsService.getGroup(groupId);

      if (!groupInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find a group with Id: ${groupId}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      return new ResponseHandlingService(res, groupInDb, StatusCodes.OK);
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

  async deleteGroup(req: Request, res: Response) {
    try {
      const groupId = parseInt(req.params.id);

      const groupInDb = await this.userGroupsService.getGroup(groupId);

      if (!groupInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find a group with Id: ${groupId}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      await this.userGroupsService.deleteGroup(groupId);

      return new ResponseHandlingService(
        res,
        new MessageResponse(`Group: ${groupInDb.name} deleted successfully`),
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

  async addNewGroup(req: Request, res: Response) {
    try {
      const userGroupDto: AddOrUpdateUserGroupDto = {
        roles: req.body.roles
          ? [...(req.body.roles as string[])]
              .filter((s) => s !== ",")
              .map((s) => parseInt(s))
          : [],
        name: req.body.name,
      };

      const newUserGroup = await this.userGroupsService.addGroup(userGroupDto);

      return new ResponseHandlingService(
        res,
        newUserGroup,
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

  async updateGroup(req: Request, res: Response) {
    try {
      const groupId = parseInt(req.params.id);

      const userGroupDto: AddOrUpdateUserGroupDto = {
        roles: req.body.roles
          ? [...(req.body.roles as string[])]
              .filter((s) => s !== ",")
              .map((s) => parseInt(s))
          : [],
        name: req.body.name,
      };

      const groupInDb = await this.userGroupsService.getGroup(groupId);

      if (!groupInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find a group with Id: ${groupId}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      const updatedUserGroup = await this.userGroupsService.updateGroup(
        userGroupDto,
        groupInDb
      );

      return new ResponseHandlingService(
        res,
        new MessageResponse(
          `Group: ${updatedUserGroup.name} has been updated successfully`
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
