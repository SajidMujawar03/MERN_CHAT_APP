import  { Router } from "express";
import type { Route } from "../interfaces/route.interface.ts";
import authController from "../controllers/auth.controller.ts";
import ValidationMiddleware from "../middleware/validation.middleware.ts";
import { registerUserSchema } from "../schemas/user.schema.ts";

class AuthRouter implements Route {
  public path: string = "/auth";
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`,ValidationMiddleware.zodValidate(registerUserSchema), authController.register);
    this.router.post(`${this.path}/login`, authController.login);
  }
}

export default new AuthRouter();
