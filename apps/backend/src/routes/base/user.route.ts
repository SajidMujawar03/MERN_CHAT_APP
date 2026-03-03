/**
 * @author: Sajid Mujawar
 */

import { Router } from "express";
import type { IRoute } from "../../interfaces/index.ts";
import { userController } from "../../controllers/index.ts";
import ValidationMiddleware from "../../middleware/validation.middleware.ts";
import { userSchema } from "../../schemas/index.ts";
import authMiddleware from "../../middleware/auth.middleware.ts";

class UserRouter implements IRoute {
  public path: string = "/users";
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware.verifyToken,
      ValidationMiddleware.zodValidate(userSchema.GetAllUsersSchema),
      userController.getAllUser,
    );
  }
}

export default new UserRouter();
