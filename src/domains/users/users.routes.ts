import { authenticationAndAuthorizationMiddleware } from "../../shared/middlewares/authentication-and-authorization.middleware";
import { UsersController } from "./users.controller";
import { Router, Request, Response } from "express";
import { IRouterBase } from "../../shared/abstractions/router-base";
import fileUpload from "express-fileupload";
import { UserRoles } from "../../shared/models/user-roles";
class UserRouter implements IRouterBase<UsersController> {
  router: Router;
  controller: UsersController;

  constructor() {
    this.router = Router();
    this.controller = new UsersController();
    this.addRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  addRoutes(): void {
    this.router.get(
      "/count",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.getCountUsers(req, res);
      }
    );
    
    this.router.put("/verify", async (req: Request, res: Response) => {
      this.controller.verifyAccount(req, res);
    });

    this.router.put(
      "/ChangePassword",
      authenticationAndAuthorizationMiddleware([
        UserRoles.canChangePassword.name,
      ]),
      async (req: Request, res: Response) => {
        this.controller.changePassword(req, res);
      }
    );

    this.router.get(
      "/",
      authenticationAndAuthorizationMiddleware([UserRoles.canGetAllUsers.name]),
      async (req: Request, res: Response) => {
        this.controller.getAllUsers(req, res);
      }
    );

    this.router.get(
      "/currentUser",
      authenticationAndAuthorizationMiddleware([
        UserRoles.canGetCurrentUser.name,
      ]),
      async (req: Request, res: Response) => {
        this.controller.getCurrentUser(req, res);
      }
    );

    this.router.get(
      "/:id",
      authenticationAndAuthorizationMiddleware([UserRoles.canGetUserById.name]),
      async (req: Request, res: Response) => {
        this.controller.getUserById(req, res);
      }
    );

    // normal register from client
    this.router.post(
      "/Register",
      fileUpload({ createParentPath: true }),
      async (req: Request, res: Response) => {
        this.controller.register(req, res);
      }
    );

    //  create ad manager from panel
    this.router.post(
      "/Create",
      authenticationAndAuthorizationMiddleware([UserRoles.canAddUser.name]),
      fileUpload({ createParentPath: true }),
      async (req: Request, res: Response) => {
        this.controller.createUser(req, res);
      }
    );

    this.router.put(
      "/",
      authenticationAndAuthorizationMiddleware([UserRoles.canUpdateUser.name]),
      fileUpload({ createParentPath: true }),
      async (req: Request, res: Response) => {
        this.controller.updateUser(req, res);
      }
    );

    // this.router.delete(
    //   "/:id",
    //   authenticationAndAuthorizationMiddleware([UserRoles.canDeleteUser.name]),
    //   async (req: Request, res: Response) => {
    //     this.controller.deleteUser(req, res);
    //   }
    // );

    this.router.put(
      "/:id",
      authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]),
      async (req: Request, res: Response) => {
        this.controller.toggleActivatedUser(req, res);
      }
    );

    this.router.post("/Login", async (req: Request, res: Response) => {
      this.controller.login(req, res);
    });

    this.router.post("/Reset/Request", async (req: Request, res: Response) => {
      this.controller.requestPasswordReset(req, res);
    });

    this.router.post("/Reset", async (req: Request, res: Response) => {
      this.controller.resetPassword(req, res);
    });
  }
}

export const usersRoutes: Router = new UserRouter().getRouter();
