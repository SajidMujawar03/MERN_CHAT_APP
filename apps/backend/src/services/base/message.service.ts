/**
 * @author: Sajid Mujawar
 */

import { Types } from "mongoose";
import { chatRepository, messageRepository, userRepository } from "../../repository/index.ts";

class MessageService {
  async sendMessage(sender: string, content: string, chat: string) {
    let message: any = await messageRepository.createMessage({
      sender: new Types.ObjectId(sender),
      content,
      chat: new Types.ObjectId(chat),
    });

    message = await messageRepository.populateByMessage(message, "sender", "name pic");

    message = await messageRepository.populateByMessage(message, "chat");

    message = await userRepository.populateByUser(message, "chat.users", "name pic email");

    await chatRepository.updateLatestMessage(chat, message._id);

    return message;
  }

  async allMessage(chat: string) {
    const messages = await messageRepository.findMessagesByChatId(chat);

    return messages;
  }
}

export default new MessageService();
