import { NextFunction, Request,  Response } from "express";
import { BadRequestError } from "../error/error";
import chatService from "../services/chat.service";

class ChatController {
  async accessChat(req: Request, res: Response, next: NextFunction) {
    try {

      const { userId } = req.body;
      const user=req.user!;

      if (!userId) throw new BadRequestError("Please Select User");

      const chatData = await chatService.accessChat(userId, user._id);


      return res
        .status(200)
        .json({ success: true, message: "Chat fetched", data: chatData });
    } catch (error) {
      next(error);
    }
  }

  async createGroupChat(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.name || !req.body.users)
        throw new BadRequestError("All Fields Are Required");
     
      const users = JSON.parse(req.body.users);

      if (users.length < 2)
        throw new BadRequestError("Too few members selected");

      users.push(req.user);

      const result = await chatService.createGroupChat(
        req.body.name,
        users,
        req.user!._id
      );

      return res
        .status(200)
        .json({ success: true, message: "Created Group Chat", data: result });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async fetchChat(req: Request, res: Response, next: NextFunction) {
    try {
      const chats = await chatService.fetchChat(req.user!._id);

      return res
        .status(200)
        .json({ success: true, message: "chats fetched", data: chats });
    } catch (error) {
      next(error);
    }
  }

  async renameGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const {chatName , chatId}=req.body;

      const updatedChat=await chatService.renameGroup(chatName,chatId);

      return res.status(200).json({success:true,message:"Group name updated",data:updatedChat})
    } catch (error) {
      next(error);
    }
  }

  async removeFromGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const {chatId,userId}=req.body;

      if(!chatId || !userId)
        throw new BadRequestError("All Fields Required");

      const updatedChat=await chatService.removeFromGroup(chatId,userId)

      res.status(200).json({success:true,message:"User Removed Successfully",data:updatedChat})

    } catch (error) {
      next(error);
    }
  }

  async addToGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const {chatId,userId}=req.body

      const updatedChat=await chatService.addToGroup(chatId,userId);

      res.status(200).json({success:true,message:"User Added To Group",data:updatedChat});

    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
