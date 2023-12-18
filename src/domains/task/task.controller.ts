import { Request, Response } from "express";
import { TaskService } from "./task.service";
import { StatusCodes } from "../../shared/enums/status-codes";
import { ResponseHandlingService } from "../../shared/services/response-handling.service";
import { ErrorResponse } from "../../shared/models/error-response";
import { IUser } from "../../shared/models/user.dto";
import { TaskDto } from "./models/task.dto";
import { TaskValidator } from "./task.validator";
import { ProjectService } from "../project/project.service";
import { TaskStatus } from "../../shared/enums/task-status";

export class TaskController {
  private readonly taskService: TaskService;
  private readonly projectService: ProjectService;

  constructor() {
    this.taskService = new TaskService();
    this.projectService = new ProjectService();
  }

  async createTask(req: Request, res: Response) {
    try {
      const validationResult = TaskValidator.validateCreateTask(req);
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
      const projectInDb = await this.projectService.getProjectById(
        parseInt(req.body.projectId)
      );
      if (!projectInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Can not found project ID: ${req.body.projectId}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }
      const taskDto: TaskDto = {
        title: req.body.title,
        description: req.body.description,
        employeeId: parseInt(req.body.employeeId),
        projectId: parseInt(req.body.projectId),
      };
      const newTask = await this.taskService.createTask(taskDto);
      return new ResponseHandlingService(res, newTask, StatusCodes.Created);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async getTask(req: Request, res: Response) {
    try {
      const taskId = parseInt(req.params.id);

      const taskInDb = await this.taskService.getTaskById(taskId);
      return new ResponseHandlingService(res, taskInDb, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async getMyTasks(req: Request, res: Response) {
    try {
      const user = res.locals.user as IUser;
      const TasksInDb = await this.taskService.getMyTasks(user.userId);
      return new ResponseHandlingService(res, TasksInDb, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async getAllTasksForProject(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);
      const tasksInDb = await this.taskService.getAllTasksForProject(projectId);
      return new ResponseHandlingService(res, tasksInDb, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async getAllMyTasksForEmployee(req: Request, res: Response) {
    try {
      const user = res.locals.user as IUser;
      const status = req.query.status as string;
      const tasksInDb = await this.taskService.getAllMyTasksForEmployee(
        user.userId,
        status
      );
      return new ResponseHandlingService(res, tasksInDb, StatusCodes.OK);
    } catch (error: any) {
      console.log(error);
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async getAllMyTasksForManager(req: Request, res: Response) {
    try {
      const user = res.locals.user as IUser;
      const status = req.query.status as string;
      const tasksInDb = await this.taskService.getAllMyTasksForManager(
        user.userId,
        status
      );
      return new ResponseHandlingService(res, tasksInDb, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const validationResult = TaskValidator.validateUpdateTask(req);
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

      const taskDto: TaskDto = {
        title: req.body.title,
        description: req.body.description,
        taskId: parseInt(req.params.id),
        employeeId: req.body.employeeId,
        projectId: req.body.projectId,
      };

      const updatedTask = await this.taskService.updateTask(taskDto);
      return new ResponseHandlingService(res, updatedTask, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async changeTaskStatus(req: Request, res: Response) {
    try {
      const validationResult = TaskValidator.validateChangeStatus(req);
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
      const task = await this.taskService.getTaskByIdAndUserId(
        parseInt(req.params.id),
        user.userId
      );
      if (!task) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Can not found task ID: ${req.params.id}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }
      const { status } = req.body;
      const updatedTask = await this.taskService.changeStatusTask(task, status);
      return new ResponseHandlingService(res, updatedTask, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const taskId = parseInt(req.params.id);

      const result = await this.taskService.deleteTask(taskId);
      return new ResponseHandlingService(res, result, StatusCodes.OK);
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async countTasks(req: Request, res: Response) {
    try {
      const user = res.locals.user as IUser;
      const toDo = (
        await this.taskService.getAllMyTasksForManager(
          user.userId,
          TaskStatus.ToDo
        )
      ).length;
      const inProgress = (
        await this.taskService.getAllMyTasksForManager(
          user.userId,
          TaskStatus.InProgress
        )
      ).length;
      const done = (
        await this.taskService.getAllMyTasksForManager(
          user.userId,
          TaskStatus.Done
        )
      ).length;
      return new ResponseHandlingService(
        res,
        { toDo, inProgress, done },
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
}
