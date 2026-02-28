/**
 * @author: Sajid Mujawar
 */

import z from "zod"

const AccessChatSchema = z.object({
    body: z.object({
        userId: z.string().min(1, "User ID is required"),
    }),
}).strict();

const FetchChatSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    }),
}).strict();

const CreateGroupChatSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Group name is required"),
        userIds: z.array(z.string().min(1, "User ID cannot be empty")).min(2, "At least 2 users are required to create a group chat"),
    }),
}).strict();

const RenameGroupSchema = z.object({
    body: z.object({
        chatId: z.string().min(1, "Chat ID is required"),
        chatName: z.string().min(1, "Chat name is required"),
    }),
}).strict();

const AddToGroupSchema = z.object({
    body: z.object({
        chatId: z.string().min(1, "Chat ID is required"),
        userId: z.string().min(1, "User ID is required"),
    }),
}).strict();

const RemoveFromGroupSchema = z.object({
    body: z.object({
        chatId: z.string().min(1, "Chat ID is required"),
        userId: z.string().min(1, "User ID is required"),
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