/**
 * @author: Sajid Mujawar
 */

import z from "zod";
import { validationConfig } from "../../config/index.ts";

const SendMessageSchema = z.object({
    body: z.object({
        content: z.string(validationConfig.message.content.requiredMessage).min(validationConfig.message.content.min.value, validationConfig.message.content.min.message),
        chatId: z.string(validationConfig.chat.id.requiredMessage).min(validationConfig.chat.id.min.value, validationConfig.chat.id.min.message),
    }),
}).strict();


const GetMessagesSchema = z.object({
    params: z.object({
        id: z.string(validationConfig.chat.id.requiredMessage).min(validationConfig.chat.id.min.value, validationConfig.chat.id.min.message),
    }),
}).strict();

export default {
    SendMessageSchema,
    GetMessagesSchema
}