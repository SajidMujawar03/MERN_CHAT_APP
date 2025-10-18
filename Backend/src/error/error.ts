// errors/HttpErrors.ts
import { ApiError } from "./ApiError";

// 400 Bad Request
export class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

// 403 Forbidden
export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

// 404 Not Found
export class NotFoundError extends ApiError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

// 409 Conflict (useful for "already exists")
export class ConflictError extends ApiError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

// 422 Unprocessable Entity (validation errors)
export class ValidationError extends ApiError {
  constructor(message: string = "Validation Error") {
    super(message, 422);
  }
}

// 429 Too Many Requests (rate limiting)
export class TooManyRequestsError extends ApiError {
  constructor(message: string = "Too Many Requests") {
    super(message, 429);
  }
}

// 500 Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}

// 503 Service Unavailable
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = "Service Unavailable") {
    super(message, 503);
  }
}
