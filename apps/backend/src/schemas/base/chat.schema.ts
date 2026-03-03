/**
 * @author: Sajid Mujawar
 */

import z from "zod"
import { validationConfig } from "../../config/index.ts";

const AccessChatSchema = z.object({
    body: z.object({
        userId: z.string(validationConfig.user.id.requiredMessage).min(validationConfig.user.id.min.value, validationConfig.user.id.min.message),
    }),
}).strict();

const FetchChatSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    }),
}).strict();

const CreateGroupChatSchema = z.object({
    body: z.object({
        name: z.string(validationConfig.chat.name.requiredMessage).min(validationConfig.chat.name.min.value, validationConfig.chat.name.min.message),
        userIds: z.array(z.string(validationConfig.user.id.requiredMessage).min(validationConfig.user.id.min.value, validationConfig.user.id.min.message)).min(validationConfig.chat.groupChat.min.value, validationConfig.chat.groupChat.min.message),
    }),
}).strict();

const RenameGroupSchema = z.object({
    body: z.object({
        chatId: z.string(validationConfig.chat.id.requiredMessage).min(validationConfig.chat.id.min.value, validationConfig.chat.id.min.message),
        chatName: z.string(validationConfig.chat.name.requiredMessage).min(validationConfig.chat.name.min.value, validationConfig.chat.name.min.message),
    }),
}).strict();

const AddToGroupSchema = z.object({
    body: z.object({
        chatId: z.string(validationConfig.chat.id.requiredMessage).min(validationConfig.chat.id.min.value, validationConfig.chat.id.min.message),
        userId: z.string(validationConfig.user.id.requiredMessage).min(validationConfig.user.id.min.value, validationConfig.user.id.min.message),
    }),
}).strict();

const RemoveFromGroupSchema = z.object({
    body: z.object({
        chatId: z.string(validationConfig.chat.id.requiredMessage).min(validationConfig.chat.id.min.value, validationConfig.chat.id.min.message),
        userId: z.string(validationConfig.user.id.requiredMessage).min(validationConfig.user.id.min.value,validationConfig.user.id.min.message),
    }),
}).strict();


export default {
    AccessChatSchema,
    FetchChatSchema,
    CreateGroupChatSchema,
    RenameGroupSchema,
    AddToGroupSchema,
    RemoveFromGroupSchema,
}