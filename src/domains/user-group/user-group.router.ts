import { UserGroupsController } from './user-groups.controller';
import { IRouterBase } from './../../shared/abstractions/router-base';
import { Request, Response, Router } from 'express';
import { authenticationAndAuthorizationMiddleware } from '../../shared/middlewares/authentication-and-authorization.middleware';
import { UserRoles } from '../../shared/models/user-roles';

class UserGroupsRouter implements IRouterBase<UserGroupsController> {
    router: Router;
    controller: UserGroupsController;

    constructor() {
        this.router = Router();
        this.controller = new UserGroupsController();
        this.addRoutes();
    }

    getRouter(): Router {
        return this.router;
    }
    addRoutes(): void {
        this.router.get("/", authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]), async (_: Request, res: Response) => {
            await this.controller.getAllGroups(res);
        });

        this.router.get("/:id", authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]), async (req: Request, res: Response) => {
            await this.controller.getGroup(req, res);
        });

        this.router.post("/", authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]), async (req: Request, res: Response) => {
            await this.controller.addNewGroup(req, res);
        });

        this.router.put("/:id", authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]), async (req: Request, res: Response) => {
            await this.controller.updateGroup(req, res);
        });

        this.router.delete("/:id", authenticationAndAuthorizationMiddleware([UserRoles.Manager.name]), async (req: Request, res: Response) => {
            await this.controller.deleteGroup(req, res);
        });
    }
}

export const userGroupsRoutes: Router = new UserGroupsRouter().getRouter(); 