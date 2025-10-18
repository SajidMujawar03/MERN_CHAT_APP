
import { Chat } from "../models/chat.model";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";

class MessageService {
    async sendMessage(sender: string, content: string, chat: string) {

        let message: any = await Message.create(
            {
                sender,
                content,
                chat
            }
        )

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        })

        await Chat.findByIdAndUpdate(chat, {
            latestMessage: message
        })

        return message;
    }

    async allMessage(chat: string) {
        const messages = await Message.find({chat})
            .populate("sender", "name pic email")
            .populate("chat")

        return messages;
    }

}

export default new MessageService();
