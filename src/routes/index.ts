import { userGroupsRoutes } from "./../domains/user-group/user-group.router";
import { rolesRoutes } from "./../domains/roles/roles.router";
import { Request, Response, Router } from "express";
import { miscRoutes } from "../domains/misc/index";
import { usersRoutes } from "../domains/users/users.routes";


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

    
    return this.router;
  }
}

export const applicationRoutes: Router = new ApplicationRouter().getRoutes();