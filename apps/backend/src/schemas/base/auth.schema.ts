/**
 * @author: Sajid Mujawar
 */

import z from "zod";

import { validationConfig } from "../../config/index.ts";

const RegisterUserSchema = z.object({
    body: z.object({
        name: z
            .string(validationConfig.user.name.requiredMessage)
            .min(validationConfig.user.name.min.value, validationConfig.user.name.min.message),
        email: z
            .string(validationConfig.user.email.requiredMessage)
            .trim()
            .toLowerCase()
            .min(validationConfig.user.email.min.value, validationConfig.user.email.min.message)
            .email(validationConfig.user.email.invalidMessage),
        password: z
            .string(validationConfig.user.password.requiredMessage)
            .min(validationConfig.user.password.min.value, validationConfig.user.password.min.message),
        pic: z.string().url(validationConfig.user.pic.invalidMessage).optional(),
    }),
});

const LoginUserSchema = z.object({
    body: z.object({
        email: z
            .string(validationConfig.user.email.requiredMessage)
            .trim()
            .toLowerCase()
            .min(validationConfig.user.email.min.value, validationConfig.user.email.min.message)
            .email(validationConfig.user.email.invalidMessage),
        password: z
            .string(validationConfig.user.password.requiredMessage)
            .min(validationConfig.user.password.min.value, validationConfig.user.password.min.message),
    }),
}).strict();

export default {
    RegisterUserSchema,
    LoginUserSchema,
}

