import { Router } from "express";
import type { Route } from "../interfaces/route.interface.ts";
import authMiddleware from "../middleware/auth.middleware.ts";
import {messageController} from "../controllers/index.ts";

class MessageRouter implements Route {
  public path: string = "/message";
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/`,
      authMiddleware.verifyToken,
      messageController.sendMessage,
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware.verifyToken,
      messageController.allMessages,
    );
  }
}

export default new MessageRouter();
