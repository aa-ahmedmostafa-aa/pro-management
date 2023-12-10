import { Role } from './roles.entity';
import { GenericLookupRouter } from './../../shared/routers/generic-lookup.router';
import { Router } from 'express';

class RolesRouter extends GenericLookupRouter<Role>  {
    constructor() {
        super(Role, "Role");
    }
}

export const rolesRoutes: Router = new RolesRouter().getRouter(); 