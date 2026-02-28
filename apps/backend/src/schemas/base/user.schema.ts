/**
 * @author: Sajid Mujawar
 */

import z from "zod";

const GetAllUsersSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    })
}).strict();


export default {
    GetAllUsersSchema,
}