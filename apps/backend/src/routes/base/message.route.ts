/**
 * @author: Sajid Mujawar
 */

import { Router } from "express";
import type { IRoute } from "../../interfaces/index.ts";
import { messageController } from "../../controllers/index.ts";
import ValidationMiddleware from "../../middleware/validation.middleware.ts";
import { messageSchema } from "../../schemas/index.ts";
import authMiddleware from "../../middleware/auth.middleware.ts";

class MessageRouter implements IRoute {
  public path: string = "/messages";
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/`,
      authMiddleware.verifyToken,
      ValidationMiddleware.zodValidate(messageSchema.SendMessageSchema),
      messageController.sendMessage,
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware.verifyToken,
      ValidationMiddleware.zodValidate(messageSchema.GetMessagesSchema),
      messageController.allMessages,
    );
  }
}

export default new MessageRouter();
