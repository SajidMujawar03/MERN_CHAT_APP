/**
 * @author: Sajid Mujawar
 */

import { Router } from "express";
import type { Route } from "../../interfaces/route.interface.ts";
import { authController } from "../../controllers/index.ts";
import ValidationMiddleware from "../../middleware/validation.middleware.ts";
import { authSchema } from "../../schemas/index.ts";

class AuthRouter implements Route {
  public path: string = "/auth";
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      ValidationMiddleware.zodValidate(authSchema.RegisterUserSchema),
      authController.register,
    );
    this.router.post(`${this.path}/login`,
      ValidationMiddleware.zodValidate(authSchema.LoginUserSchema),
      authController.login);
  }
}

export default new AuthRouter();
