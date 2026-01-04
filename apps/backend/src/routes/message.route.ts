import { Router } from "express";
import { Route } from "../interfaces/route.interface";
import authMiddleware from "../middleware/auth.middleware";
import messageController from "../controllers/message.controller";


class MessageRouter implements Route {
    public path: string = "/message";
    public router: Router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/`, authMiddleware.verifyToken, messageController.sendMessage)
        this.router.get(`${this.path}/:id`, authMiddleware.verifyToken, messageController.allMessages)
    }
}

export default new MessageRouter();
