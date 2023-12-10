import { Router } from 'express';

export interface IRouterBase<T> {
    router: Router;
    controller: T;
    getRouter(): Router;
    addRoutes(): void;
}