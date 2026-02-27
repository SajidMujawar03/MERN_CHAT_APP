import { Router } from "express";
import type { Route } from "../interfaces/route.interface.ts";
import { userController } from "../controllers/index.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

class UserRouter implements Route {
  public path: string = "/user";
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware.verifyToken,
      userController.getAllUser,
    );
  }
}

export default new UserRouter();
