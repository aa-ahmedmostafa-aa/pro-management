import { GenericLookupController } from './../controllers/generic-lookup.controller';
import { Router, Request, Response } from 'express';
import { IRouterBase } from './../abstractions/router-base';
import { ObjectType } from 'typeorm';
import { authenticationAndAuthorizationMiddleware } from '../middlewares/authentication-and-authorization.middleware';
import { UserRoles } from '../models/user-roles';

export class GenericLookupRouter<TEntity> implements IRouterBase<GenericLookupController<TEntity>> {
    router: Router;
    controller: GenericLookupController<TEntity>;

    constructor(type: ObjectType<TEntity>, lookupName: string) {
        this.router = Router();
        this.controller = new GenericLookupController(type, lookupName);
        this.addRoutes();
    }

    getRouter(): Router {
        return this.router;
    }

    addRoutes(): void {
        this.router.get("/", async (_: Request, res: Response) => {
            this.controller.getAll(_, res);
        });

        this.router.get("/:id", authenticationAndAuthorizationMiddleware([UserRoles.canGetLookups.name]), async (req: Request, res: Response) => {
            this.controller.getOne(req, res);
        });

        this.router.post("/", authenticationAndAuthorizationMiddleware([UserRoles.canAddLookups.name]), async (req: Request, res: Response) => {
            this.controller.create(req, res);
        });

        this.router.put("/:id", authenticationAndAuthorizationMiddleware([UserRoles.canUpdateLookups.name]), async (req: Request, res: Response) => {
            this.controller.update(req, res);
        });

        this.router.delete("/:id", authenticationAndAuthorizationMiddleware([UserRoles.canDeleteLookups.name]), async (req: Request, res: Response) => {
            this.controller.delete(req, res);
        });
    }
}