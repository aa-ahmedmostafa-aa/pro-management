import { userGroupsRoutes } from "./../domains/user-group/user-group.router";
import { rolesRoutes } from "./../domains/roles/roles.router";
import { Request, Response, Router } from "express";
import { miscRoutes } from "../domains/misc/index";
import { usersRoutes } from "../domains/users/users.routes";
import { projectRoutes } from "../domains/project/project.routes";
import { taskRoutes } from "../domains/task/task.routes";


export class ApplicationRouter {
  private baseUrl = process.env.BASE_URL || "/api/v1";
  router: Router;

  constructor() {
    this.router = Router();
  }

  public getRoutes(): Router {
    this.router.use(`${this.baseUrl}/Misc`, miscRoutes);
    this.router.use(`${this.baseUrl}/Roles`, rolesRoutes);
    this.router.use(`${this.baseUrl}/UserGroups`, userGroupsRoutes);
    this.router.use(`${this.baseUrl}/Users`, usersRoutes);
    this.router.use(`${this.baseUrl}/Project`, projectRoutes);
    this.router.use(`${this.baseUrl}/Task`, taskRoutes);

    
    return this.router;
  }
}

export const applicationRoutes: Router = new ApplicationRouter().getRoutes();
