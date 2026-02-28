import type { NextFunction, Request, Response } from "express";
import { Errors } from "../../error/index.ts";
import { userService } from "../../services/index.ts";

class UserController {

  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const search = (req.query.search as string) || "";
      if (!req.user) {
        throw new Errors.UnauthorizedError("Unauthorized Access");
      }

      const users = await userService.getAllUser(search, req.user._id);

      return res.status(200).json({
        success: true,
        message: "Users Fetched Successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
