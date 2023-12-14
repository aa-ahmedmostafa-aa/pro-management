import { Request, Response } from "express";
import { StatusCodes } from "../../shared/enums/status-codes";
import { ErrorResponse } from "../../shared/models/error-response";
import { ResponseHandlingService } from "../../shared/services/response-handling.service";
import { ProjectService } from "./project.service";
import { ProjectValidator } from "./project.validator";
import { ProjectDto } from "./models/project.dto";
import { IUser } from "../../shared/models/user.dto";

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
        adminId: user.userId,
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

  async getMyProjects(req: Request, res: Response) {
    try {
      const user = res.locals.user as IUser;
      const projectsInDb = await this.projectService.getMyProjects(user.userId);
      return new ResponseHandlingService(res, projectsInDb, StatusCodes.OK);
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
      const projectsInDb = await this.projectService.getAllProjects();
      return new ResponseHandlingService(res, projectsInDb, StatusCodes.OK);
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
        adminId: user.userId,
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
