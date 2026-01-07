import z from "zod";

export const registerUserSchema = z.object({
    body:z.object({
        name:z.string("Name is required").min(5,"Name must be at least 5 characters long"),
        email: z.string().trim().toLowerCase().min(1, 'Email is required').email('Invalid email address'),
        password:z.string("Password is required" ).min(6, "Password must be at least 6 characters long"),
        pic:z.string().url("Picture must be a valid URL").optional()
    })
})