/**
 * @author: Sajid Mujawar
 */

import z from "zod";

const SendMessageSchema = z.object({
    body: z.object({
        content: z.string().min(1, "Message content is required"),
        chatId: z.string().min(1, "Chat ID is required"),
    }),
});


const GetMessagesSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Chat ID is required"),
    }),
});

export default {
    SendMessageSchema,
    GetMessagesSchema
}