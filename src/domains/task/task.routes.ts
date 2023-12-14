import { Request, Response, Router } from "express";
import { IRouterBase } from "../../shared/abstractions/router-base";
import { TaskController } from "./task.controller";
import { authenticationAndAuthorizationMiddleware } from "../../shared/middlewares/authentication-and-authorization.middleware";
import { UserRoles } from "../../shared/models/user-roles";

class TaskRouter implements IRouterBase<TaskController> {
  router: Router;
  controller: TaskController;

  constructor() {
    this.router = Router();
    this.controller = new TaskController();
    this.addRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  addRoutes(): void {
    this.router.post(
      "/",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.createTask(req, res);
      }
    );

    this.router.get(
      "/:id",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name, UserRoles.Employee.name]),
      async (req: Request, res: Response) => {
        this.controller.getTask(req, res);
      }
    );

    this.router.get(
      "/project/:id",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.getAllTasksForProject(req, res);
      }
    );

    this.router.get(
      "/",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.getAllMyTasks(req, res);
      }
    );

    this.router.put(
      "/:id",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.updateTask(req, res);
      }
    );

    this.router.delete(
      "/:id",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.deleteTask(req, res);
      }
    );
  }
}

export const taskRoutes: Router = new TaskRouter().getRouter();
