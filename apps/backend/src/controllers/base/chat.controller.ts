import type { NextFunction, Request, Response } from "express";
import { Errors } from "../../error/index.ts";
import { chatService } from "../../services/index.ts";
import ResponseUtils from "../../utils/base/response.util.ts";
import { httpStatusCodeConfig } from "../../config/index.ts";

class ChatController {

  async accessChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      const user = req.user;

      if (!userId) throw new Errors.BadRequestError(["User Selection Required"]);

      const chatData = await chatService.accessChat(userId, user._id);

      return ResponseUtils.success(res, chatData, "Chat fetched", httpStatusCodeConfig.OK);
    } catch (error) {
      next(error);
    }
  }

  async createGroupChat(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.name || !req.body.users)
        throw new Errors.BadRequestError(["All Fields Are Required"]);

      const users = JSON.parse(req.body.users);

      if (users.length < 2)
        throw new Errors.BadRequestError(["Too Few Members Selected"]);

      users.push(req.user);

      const result = await chatService.createGroupChat(
        req.body.name,
        users,
        req.user!._id,
      );

      return ResponseUtils.success(res, result, "Created Group Chat", httpStatusCodeConfig.CREATED);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async fetchChat(req: Request, res: Response, next: NextFunction) {
    try {
      const chats = await chatService.fetchChat(req.user!._id);

      return ResponseUtils.success(res, chats, "chats fetched", httpStatusCodeConfig.OK);
    } catch (error) {
      next(error);
    }
  }

  async renameGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatName, chatId } = req.body;

      const updatedChat = await chatService.renameGroup(chatName, chatId);

      return ResponseUtils.success(res, updatedChat, "Group name updated", );
    } catch (error) {
      next(error);
    }
  }

  async removeFromGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId, userId } = req.body;

      if (!chatId || !userId) throw new Errors.BadRequestError(["All Fields Required"]);

      const updatedChat = await chatService.removeFromGroup(chatId, userId);

      return ResponseUtils.success(res, updatedChat, "User Removed successfully", 200);
    } catch (error) {
      next(error);
    }
  }

  async addToGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId, userId } = req.body;

      const updatedChat = await chatService.addToGroup(chatId, userId);

      return ResponseUtils.success(res, updatedChat, "User Added To Group", 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
