import type { NextFunction, Request, Response } from "express";
import { userService } from "../../services/index.ts";
import  ResponseUtils from "../../utils/base/response.util.ts";

class UserController {

  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const search = (req.query.search as string) || "";

      const users = await userService.getAllUser(search, req.user._id);

      return ResponseUtils.success(res, users, "Users Fetched successfully", 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
