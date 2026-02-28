import { IMessage } from "../../interfaces/types.d.js";
import { Message } from "../../models/index.ts";

class MessageRepository {
    async createMessage(messageData: Partial<IMessage>) {
        return await Message.create(messageData);
    }

    async populateByMessage<T>(document: T, path: string, select?: string) {
        return await Message.populate<T>(document, {
            path: path,
            select: select,
        })
    }

    async findMessagesByChatId(chatId: string) {
        return await Message.find({ chat: chatId })
            .populate("sender", "name pic email")
            .populate("chat");
    }

}

export default new MessageRepository();