import httpStatusCodeConfig from "./httpStatus.config.ts";

const errorConfig = {
    BAD_REQUEST: {
        code: "BAD_REQUEST",
        message: "Bad Request",
        statusCode: httpStatusCodeConfig.BAD_REQUEST
    },
    UNAUTHORIZED: {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
        statusCode: httpStatusCodeConfig.UNAUTHORIZED
    },
    FORBIDDEN: {
        code: "FORBIDDEN",
        message: "Forbidden",
        statusCode: httpStatusCodeConfig.FORBIDDEN
    },
    NOT_FOUND: {
        code: "NOT_FOUND",
        message: "Not Found",
        statusCode: httpStatusCodeConfig.NOT_FOUND
    },
    CONFLICT: {
        code: "CONFLICT",
        message: "Conflict",
        statusCode: httpStatusCodeConfig.CONFLICT
    },
    VALIDATION_ERROR: {
        code: "VALIDATION_ERROR",
        message: "Validation Error",
        statusCode: httpStatusCodeConfig.VALIDATION_ERROR
    },
    INTERNAL_SERVER_ERROR: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
        statusCode: httpStatusCodeConfig.INTERNAL_SERVER_ERROR
    },
    TOO_MANY_REQUESTS: {
        code: "TOO_MANY_REQUESTS",
        message: "Too Many Requests",
        statusCode: httpStatusCodeConfig.TOO_MANY_REQUESTS
    },
    SERVICE_UNAVAILABLE: {
        code: "SERVICE_UNAVAILABLE",
        message: "Service Unavailable",
        statusCode: httpStatusCodeConfig.SERVICE_UNAVAILABLE
    }
} as const;

export default errorConfig;