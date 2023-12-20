import { Request, Response } from "express";
import { StatusCodes } from "../../shared/enums/status-codes";
import { ErrorResponse } from "../../shared/models/error-response";
import { ResponseHandlingService } from "../../shared/services/response-handling.service";
import { ProjectService } from "./project.service";
import { ProjectValidator } from "./project.validator";
import { ProjectDto } from "./models/project.dto";
import { IUser } from "../../shared/models/user.dto";
import { IPaginatedRequest } from "../../shared/models/paginated-request";
import { PaginationUtils } from "../../shared/services/pagination-utils.service";

export class ProjectController {
  private readonly projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  async createProject(req: Request, res: Response) {
    try {
      const validationResult = ProjectValidator.validateCreateProject(req);
      if (!validationResult.status) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            validationResult.errorMessage,
            StatusCodes.BadRequest,
            validationResult.error
          ),
          StatusCodes.BadRequest
        );
      }
      const user = res.locals.user as IUser;
      const projectDto: ProjectDto = {
        title: req.body.title,
        description: req.body.description,
        managerId: user.userId,
      };
      const newProject = await this.projectService.createProject(projectDto);
      return new ResponseHandlingService(res, newProject, StatusCodes.Created);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async getProject(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);

      const projectInDb = await this.projectService.getProjectById(projectId);
      return new ResponseHandlingService(res, projectInDb, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async getMyProjectsForManager(req: Request, res: Response) {
    try {
      const user = res.locals.user as IUser;
      const paginatedRequestMeta: IPaginatedRequest =
        PaginationUtils.getPaginationRequirementsFromRequest(req);
      const requestDetails = {
        pageNumber: paginatedRequestMeta.pageNumber,
        pageSize: paginatedRequestMeta.pageSize,
        managerId: user.userId,
      };
      const projectsInDb = await this.projectService.getMyProjectsForManager(
        requestDetails
      );
      return new ResponseHandlingService(
        res,
        PaginationUtils.getPaginatedResponse(
          paginatedRequestMeta.pageNumber,
          paginatedRequestMeta.pageSize,
          projectsInDb[0],
          projectsInDb[1]
        ),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async getMyProjectsForEmployee(req: Request, res: Response) {
    try {
      const user = res.locals.user as IUser;
      const paginatedRequestMeta: IPaginatedRequest =
        PaginationUtils.getPaginationRequirementsFromRequest(req);
      const requestDetails = {
        pageNumber: paginatedRequestMeta.pageNumber,
        pageSize: paginatedRequestMeta.pageSize,
        employeeId: user.userId,
      };
      const projectsInDb = await this.projectService.getMyProjectsForEmployee(
        requestDetails
      );
      return new ResponseHandlingService(
        res,
        PaginationUtils.getPaginatedResponse(
          paginatedRequestMeta.pageNumber,
          paginatedRequestMeta.pageSize,
          projectsInDb[0],
          projectsInDb[1]
        ),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async getAllProjects(req: Request, res: Response) {
    try {
      const paginatedRequestMeta: IPaginatedRequest =
        PaginationUtils.getPaginationRequirementsFromRequest(req);
      const projectsInDb = await this.projectService.getAllProjects(
        paginatedRequestMeta
      );
      return new ResponseHandlingService(
        res,
        PaginationUtils.getPaginatedResponse(
          paginatedRequestMeta.pageNumber,
          paginatedRequestMeta.pageSize,
          projectsInDb[0],
          projectsInDb[1]
        ),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const validationResult = ProjectValidator.validateCreateProject(req);
      if (!validationResult.status) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            validationResult.errorMessage,
            StatusCodes.BadRequest,
            validationResult.error
          ),
          StatusCodes.BadRequest
        );
      }
      const user = res.locals.user as IUser;
      const projectDto: ProjectDto = {
        title: req.body.title,
        description: req.body.description,
        managerId: user.userId,
        projectId: parseInt(req.params.id),
      };

      const updatedProject = await this.projectService.updateProject(
        projectDto
      );
      return new ResponseHandlingService(
        res,
        updatedProject,
        StatusCodes.Created
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);

      const result = await this.projectService.deleteProject(projectId);
      return new ResponseHandlingService(res, result, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }
}
