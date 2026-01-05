import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../error/error";
import messageService from "../services/message.service";

class MessageController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const sender=req.user!._id;
      const {content,chat}=req.body;
      if(!content || !chat)
        throw new BadRequestError("Provide ChatId and Content")
      const message=await messageService.sendMessage(sender,content,chat)

      return res.status(200).json({success:true,message:"Message sent",data:message})
    } catch (error) {
      next(error);
    }
  }

  async allMessages(req: Request, res: Response, next: NextFunction){
        try {

       
            const {id}=req.params;
         
            if(!id)
              throw new BadRequestError("Please provide Chat Id")

            const allMessages=await messageService.allMessage(id)

            res.status(200).json({success:true,message:"Messages Fetched",data:allMessages})
            
        } catch (error) {
          next(error)  
        }
  }
}

export default new MessageController();
