import  { Router } from "express";
import type { Route } from "../interfaces/route.interface";
import authMiddleware from "../middleware/auth.middleware";
import chatController from "../controllers/chat.controller";

class ChatRouter implements Route {
  public path: string = "/chat";
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware.verifyToken,chatController.accessChat);
    this.router.get(`${this.path}`, authMiddleware.verifyToken,chatController.fetchChat);
    this.router.post(`${this.path}/create-group-chat`, authMiddleware.verifyToken,chatController.createGroupChat);
    this.router.put(`${this.path}/rename-group`, authMiddleware.verifyToken,chatController.renameGroup);
    this.router.put(`${this.path}/add-to-group`, authMiddleware.verifyToken,chatController.addToGroup); 
    this.router.put(`${this.path}/remove-from-group`, authMiddleware.verifyToken,chatController.removeFromGroup);

   
  }
}

export default new ChatRouter();
