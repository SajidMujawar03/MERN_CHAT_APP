import type { NextFunction, Request, Response } from "express";
import { Errors } from "../../error/index.ts";
import { messageService } from "../../services/index.ts";
import ResponseUtils from "../../utils/base/response.util.ts";

class MessageController {

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const sender = req.user!._id;
      const { content, chat } = req.body;
      if (!content || !chat)
        throw new Errors.BadRequestError(["Sending message"]);
      const message = await messageService.sendMessage(sender, content, chat);

      return ResponseUtils.success(res, message, "Message sent", 200);
    } catch (error) {
      next(error);
    }
  }

  async allMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) throw new Errors.BadRequestError(["Accessing messages"]);

      const allMessages = await messageService.allMessage(id);

      return ResponseUtils.success(res, allMessages, "Messages Fetched", 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
