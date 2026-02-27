import { Types } from "mongoose";
import { Errors } from "../error/index.ts";
import type {  IUser } from "../interfaces/types.d.ts";
import { chatRepository, userRepository } from "../repository/index.ts";

class chatService {
  async accessChat(userId: string, currentUserId: string) {
    let isChat = await chatRepository.isSingleChat(userId, currentUserId);

    isChat = await userRepository.populateUser("latestMessage.sender", "name pic email", isChat);

    if (isChat.length > 0) {
      return isChat[0];
    }
    else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [currentUserId, userId].map((id) => new Types.ObjectId(id)),
      };

      const chat = await chatRepository.createChat(chatData);

      const fullChat = await chatRepository.findChatById(chat._id);

      if (!fullChat) {
        throw new Errors.NotFoundError("Failed to create or fetch chat");
      }
      return fullChat;
    }
  }

  async fetchChat(userId: string) {
    const chat = await chatRepository.findChatsByUserId(userId, -1);

    const fullChat = await userRepository.populateUser("latestMessage.sender", "name pic email", chat)

    return fullChat;
  }

  async createGroupChat(name: string, users: IUser[], currentUserId: string) {
    const groupChat = await chatRepository.createGroupChat(name, users.map((user) => user._id.toString()), currentUserId);

    const fullChat = await chatRepository.findChatById(groupChat._id);

    return fullChat;
  }

  async renameGroup(chatName: string, chatId: string) {
    const updatedChat = await chatRepository.renameGroup(chatName, chatId);

    if (!updatedChat) throw new Errors.NotFoundError("Chat Not Found");

    return updatedChat;
  }

  async addToGroup(chatId: string, userId: string) {
    const updatedGroup = await chatRepository.addToGroup(chatId, userId);

    if (!updatedGroup) throw new Errors.NotFoundError("Group Not Found");

    return updatedGroup;
  }

  async removeFromGroup(chatId: string, userId: string) {
    const updatedGroup = await chatRepository.removeFromGroup(chatId, userId);

    if (!updatedGroup) throw new Errors.NotFoundError("Group Not Found");

    return updatedGroup;
  }
}

export default new chatService();
