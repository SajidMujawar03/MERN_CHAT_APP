import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { BadRequestError } from "../error/error";


class UserController {
  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const search  = req.query.search as string||"";
      
      const users = await userService.getAllUser(search,req.user?._id!);

      return res
        .status(200)
        .json({ success: true, message: "Users Fetched Successfully", data: users });
    } catch (error) {
      next(error);
    }
  }

}

export default new UserController();
