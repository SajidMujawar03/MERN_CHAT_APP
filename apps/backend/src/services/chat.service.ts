import { NotFoundError } from "../error/error";
import { IChat, IUser } from "../interfaces/types";
import { Chat } from "../models/chat.model";
import { User } from "../models/user.model";

class chatService {
  async accessChat(userId: string, currentUserId: string) {
    
    let isChat = await Chat.find<IChat>({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: currentUserId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate<IChat>(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });



    if (isChat.length > 0) {
      return isChat[0];
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [currentUserId, userId],
      };

      const chat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: chat._id }).populate(
        "users",
        "-password"
      );

      if (!fullChat) {
        throw new NotFoundError("Failed to create or fetch chat");
      }
      return fullChat;
    }
  }

  async fetchChat(userId: string) {
    const chat = await Chat.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const fullChat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

  

    return fullChat;
  }

  async createGroupChat(name: string, users: IUser[], currentUserId: string) {
    const groupChat = await Chat.create({
      isGroupChat: true,
      groupAdmin: currentUserId,
      users: users,
      chatName: name,
    });


    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return fullChat;
  }

  async renameGroup(chatName: string, chatId: string) {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) throw new NotFoundError("Chat Not Found");

    return updatedChat;
  }

  async addToGroup(chatId: string, userId: string) {
    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: {
          users: userId,
        },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedGroup) throw new NotFoundError("Group Not Found");

    return updatedGroup;
  }

  async removeFromGroup(chatId: string, userId: string) {
    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          users: userId,
        },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedGroup) throw new NotFoundError("Group Not Found");

    return updatedGroup;
  }
}

export default new chatService();
