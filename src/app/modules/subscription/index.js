import { Router } from 'express';
import endpoints from './endpoints';

export class SubscriptionModule {
    apiRouter;
    router;

    constructor (apiRouter) {
        this.apiRouter = apiRouter;
        this.router = Router();
    }

    createEndpoints() {
        this.assignRouter();
        this.assignEndpoints();
    }

    assignRouter() {
        this.apiRouter.use('/subscriptions', this.router);
    }

    assignEndpoints() {
        endpoints(this.router);
    }
}
