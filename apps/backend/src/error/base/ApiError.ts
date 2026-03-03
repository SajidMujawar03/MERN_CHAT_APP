import type { ErrorType } from "../../interfaces/base/error.d.ts";

// errors/ApiError.ts
export default class ApiError extends Error {
  statusCode: number;
  errors: any[];

  constructor(errors: ErrorType[], message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
