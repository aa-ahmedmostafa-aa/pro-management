import { Request, Response, Router } from "express";
import { IRouterBase } from "../../shared/abstractions/router-base";
import { ProjectController } from "./project.controller";
import { authenticationAndAuthorizationMiddleware } from "../../shared/middlewares/authentication-and-authorization.middleware";
import { UserRoles } from "../../shared/models/user-roles";

class ProjectRouter implements IRouterBase<ProjectController> {
  router: Router;
  controller: ProjectController;

  constructor() {
    this.router = Router();
    this.controller = new ProjectController();
    this.addRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  addRoutes(): void {
    this.router.get(
      "/manager",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.getMyProjects(req, res);
      }
    );
    
    this.router.post(
      "/",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.createProject(req, res);
      }
    );

    this.router.get(
      "/:id",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.getProject(req, res);
      }
    );

    this.router.get(
      "/",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.getAllProjects(req, res);
      }
    );

    this.router.put(
      "/:id",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.updateProject(req, res);
      }
    );

    this.router.delete(
      "/:id",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.deleteProject(req, res);
      }
    );
  }
}

export const projectRoutes: Router = new ProjectRouter().getRouter();
