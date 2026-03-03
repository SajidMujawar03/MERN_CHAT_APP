const httpStatusCodeConfig = {
    OK: 200,
    CREATED: 201,
    ACCEPTED:203,
    UPDATED: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,
    INTERNAL_SERVER_ERROR: 500,
    TOO_MANY_REQUESTS: 429,
    SERVICE_UNAVAILABLE: 503
} as const;

export default httpStatusCodeConfig;