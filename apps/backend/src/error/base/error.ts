import { ZodIssue } from "zod/v3";
import { errorConfig } from "../../config/index.ts";
import type { ErrorType } from "../../interfaces/base/error.d.ts";
import ApiError from "./ApiError.ts";

// 400 Bad Request
export class BadRequestError extends ApiError {
  constructor(resources: string[]) {
    const errors: ErrorType[] = resources.map(resource => ({
      code: errorConfig.BAD_REQUEST.code,
      message: `Invalid Request : ${resource}`,
      details: null
    }));


    super(errors, errorConfig.BAD_REQUEST.message, errorConfig.BAD_REQUEST.statusCode);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends ApiError {
  constructor(resources: string[]) {

    const errors: ErrorType[] = resources.map(resource => ({
      code: errorConfig.UNAUTHORIZED.code,
      message: `Unauthorized Access : ${resource}`,
      details: null
    }));
    super(errors, errorConfig.UNAUTHORIZED.message, errorConfig.UNAUTHORIZED.statusCode);
  }
}

// 403 Forbidden
export class ForbiddenError extends ApiError {
  constructor(resources: string[]) {
    const errors: ErrorType[] = resources.map(resource => ({
      code: errorConfig.FORBIDDEN.code,
      message: `Forbidden Access to ${resource}`,
      details: null
    }));

    super(errors, errorConfig.FORBIDDEN.message, errorConfig.FORBIDDEN.statusCode);
  }
}

// 404 Not Found
export class NotFoundError extends ApiError {
  constructor(resources: string[]) {
    const errors: ErrorType[] = resources.map(resource => ({
      code: errorConfig.NOT_FOUND.code,
      message: `${resource} Not Found`,
      details: null
    }));

    super(errors, errorConfig.NOT_FOUND.message, errorConfig.NOT_FOUND.statusCode);
  }
}

// 409 Conflict (useful for "already exists")
export class ConflictError extends ApiError {
  constructor(resources: string[]) {
    const errors: ErrorType[] = resources.map(resource => ({
      code: errorConfig.CONFLICT.code,
      message: `${resource} already exists`,
      details: null
    }));
    super(errors, errorConfig.CONFLICT.message, errorConfig.CONFLICT.statusCode);
  }
}

// 422 Unprocessable Entity (validation errors)
export class ValidationError extends ApiError {
  constructor(issues: ZodIssue[]) {
    const errors: ErrorType[] = issues.map(issue => ({
      code: errorConfig.VALIDATION_ERROR.code,
      message: `${issue.path.join(".")} - ${issue.message}`,
      details: issues
    }));
    super(errors, errorConfig.VALIDATION_ERROR.message, errorConfig.VALIDATION_ERROR.statusCode);
  }
}

// 429 Too Many Requests (rate limiting)
export class TooManyRequestsError extends ApiError {
  constructor() {
    const errors: ErrorType[] = [{
      code: errorConfig.TOO_MANY_REQUESTS.code,
      message: "Too many requests. Please try again later.",
      details: null
    }];
    super(errors, errorConfig.TOO_MANY_REQUESTS.message, errorConfig.TOO_MANY_REQUESTS.statusCode);
  }
}

// 500 Internal Server Error
export class InternalServerError extends ApiError {
  constructor() {
    const errors: ErrorType[] = [{
      code: errorConfig.INTERNAL_SERVER_ERROR.code,
      message: "An unexpected error occurred. Please try again later.",
      details: null
    }];
    super(errors, errorConfig.INTERNAL_SERVER_ERROR.message, errorConfig.INTERNAL_SERVER_ERROR.statusCode);
  }
}

// 503 Service Unavailable
export class ServiceUnavailableError extends ApiError {
  constructor() {
      const errors: ErrorType[] = [{
        code: errorConfig.SERVICE_UNAVAILABLE.code,
        message: "Service is currently unavailable. Please try again later.",
        details: null
      }];
    super(errors, errorConfig.SERVICE_UNAVAILABLE.message, errorConfig.SERVICE_UNAVAILABLE.statusCode);
  }
}


export default {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
  InternalServerError,
  ServiceUnavailableError,
  ApiError
};