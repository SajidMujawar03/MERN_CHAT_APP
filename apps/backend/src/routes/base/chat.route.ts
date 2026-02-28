/**
 * @author: Sajid Mujawar
 */

import { Router } from "express";
import type { Route } from "../../interfaces/route.interface.ts";
import { chatController } from "../../controllers/index.ts";
import ValidationMiddleware from "../../middleware/validation.middleware.ts";
import { chatSchema } from "../../schemas/index.ts";
import authMiddleware from "../../middleware/auth.middleware.ts";

class ChatRouter implements Route {
  public path: string = "/chat";
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware.verifyToken,
      ValidationMiddleware.zodValidate(chatSchema.AccessChatSchema),
      chatController.accessChat,
    );
    this.router.get(
      `${this.path}`,
      authMiddleware.verifyToken,
      ValidationMiddleware.zodValidate(chatSchema.FetchChatSchema),
      chatController.fetchChat,
    );
    this.router.post(
      `${this.path}/create-group-chat`,
      authMiddleware.verifyToken,
      ValidationMiddleware.zodValidate(chatSchema.CreateGroupChatSchema),
      chatController.createGroupChat,
    );
    this.router.put(
      `${this.path}/rename-group`,
      authMiddleware.verifyToken,
      ValidationMiddleware.zodValidate(chatSchema.RenameGroupSchema),
      chatController.renameGroup,
    );
    this.router.put(
      `${this.path}/add-to-group`,
      authMiddleware.verifyToken,
      ValidationMiddleware.zodValidate(chatSchema.AddToGroupSchema),
      chatController.addToGroup,
    );
    this.router.put(
      `${this.path}/remove-from-group`,
      authMiddleware.verifyToken,
      ValidationMiddleware.zodValidate(chatSchema.RemoveFromGroupSchema),
      chatController.removeFromGroup,
    );
  }
}

export default new ChatRouter();
