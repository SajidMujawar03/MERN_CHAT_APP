import  { Router } from "express";
import type { Route } from "../interfaces/route.interface";
import authController from "../controllers/auth.controller";

class AuthRouter implements Route {
  public path: string = "/auth";
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, authController.register);
    this.router.post(`${this.path}/login`, authController.login);
  }
}

export default new AuthRouter();
