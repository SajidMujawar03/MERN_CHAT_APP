
const validationMessages = {
    required: (value: string) => `${value} is required`,
    min: (value: string, min: number) => `${value} must be at least ${min} characters long`,
    max: (value: string, max: number) => `${value} must be at most ${max} characters long`,
    invalid: (value: string) => `Invalid ${value}`,
    groupChatMIN: (min: number) => `A group chat must have at least ${min} members`
}


const validationConfig = {
    user: {
        email: {
            min: {
                value: 1,
                message: validationMessages.required("Email")
            },
            requiredMessage: validationMessages.required("Email"),
            invalidMessage: validationMessages.invalid("Email")
        },
        id: {
            requiredMessage: validationMessages.required("User ID"),
            min: {
                value: 1,
                message: validationMessages.required("User ID")
            }
        },
        name: {
            min: {
                value: 3,
                message: validationMessages.min("Username", 3)
            },
            max: {
                value: 50,
                message: validationMessages.max("Username", 50)
            },
            requiredMessage: validationMessages.required("Username")
        },
        password: {
            min: {
                value: 6,
                message: validationMessages.min("Password", 6)
            },
            requiredMessage: validationMessages.required("Password")
        },
        pic: {
            invalidMessage: validationMessages.invalid("Profile picture URL")
        }
    },
    chat: {
        id: {
            requiredMessage: validationMessages.required("Chat ID"),
            min: {
                value: 1,
                message: validationMessages.min("Chat ID",1)
            }
        },
        groupChat: {
            min: {
                value: 2,
                message: validationMessages.groupChatMIN(2)
            }
        },
        name: {
            requiredMessage: validationMessages.required("Chat name"),
            min: {
                value: 1,
                message: validationMessages.min("Chat name",1)
            }
        },
    },
    message: {
        content: {
            requiredMessage: validationMessages.required("Message content"),
            min: {
                value: 1,
                message: validationMessages.min("Message content",1)
            }
        }

    }
} as const;

export default validationConfig;
