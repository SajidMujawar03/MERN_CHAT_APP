import type { NextFunction, Request, Response } from "express";
import { Errors } from "../../error/index.ts";
import { authService } from "../../services/index.ts";
import ResponseUtils from "../../utils/base/response.util.ts";
import { httpStatusCodeConfig } from "../../config/index.ts";
/**
 * Auth Controller
 * Handles user registration and login
 */
class AuthController {

  /**
   *
   * @param req
   * @param res 200 {success:true,message:"User Registered!!",data:user}
   * @param next
   * @returns
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, pic, name } = req.body;

      const user = await authService.register(email, password, pic, name);

      return ResponseUtils.success(res, user, "User Registered!!", httpStatusCodeConfig.CREATED);
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Errors.BadRequestError(["All fields are required!"]);
      }
      const user = await authService.login(email, password);

      return ResponseUtils.success(res, user, "User Logged In", httpStatusCodeConfig.OK);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
