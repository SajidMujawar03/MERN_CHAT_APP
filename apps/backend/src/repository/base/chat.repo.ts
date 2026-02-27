import { SortOrder } from "mongoose";
import { IChat } from "../../interfaces/types.d.js";
import { Chat } from "../../models/index.ts";

class ChatRepository {
    async removeFromGroup(chatId: string, userId: string) {
        return await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: {
                    users: userId,
                },
            },
            { new: true },
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
    }

    async addToGroup(chatId: string, userId: string) {
        return await Chat.findByIdAndUpdate(
            chatId,
            {
                $addToSet: {
                    users: userId,
                },
            },
            { new: true },
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
    }

    async renameGroup(chatName: string, chatId: string) {
        return await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName,
            },
            {
                new: true,
            },
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
    }

    async isSingleChat(userId: string, currentUserId: string) {
        return await Chat.find<IChat>({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: currentUserId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");
    }

    async createChat(chatData: IChat | Partial<IChat>) {
        return await Chat.create(chatData)
    }

    async findChatById(chatId: string) {
        return await Chat.findOne({ _id: chatId }).populate(
            "users",
            "-password",
        );
    }

    async findChatsByUserId(userId: string, updatedAt: SortOrder) {
        return await Chat.find({
            users: { $elemMatch: { $eq: userId } },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: updatedAt })
    }

    async createGroupChat(name: string, users: string[], currentUserId: string) {
        return await Chat.create({
            isGroupChat: true,
            groupAdmin: currentUserId,
            users: users,
            chatName: name,
        })
    }

    async findGroupChatById(chatId: string) {
        return await Chat.findOne({ _id: chatId })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
    }
}

export default new ChatRepository();
