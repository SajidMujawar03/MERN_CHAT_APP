import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";
import { BadRequestError } from "../error/error";
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
      if (!email || !password || !name) {
        throw new BadRequestError("email,password,name should be present !");
      }

      const user = await authService.register(email, password, pic, name);

      return res
        .status(200)
        .json({ success: true, message: "User Registered!!", data: user });
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
        throw new BadRequestError("All fields are required!");
      }
      const user = await authService.login(email, password);

      res.status(200).json({success:true,message:"User Logged In",data:user})
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
