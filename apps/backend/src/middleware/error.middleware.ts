import type { Request, Response, NextFunction } from "express";
import { Errors } from "../error/index.ts";
import ResponseUtils from "../utils/base/response.util.ts";
import { errorConfig } from "../config/index.ts";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars*/
  _next: NextFunction,
): void => {
  if (err instanceof Errors.ApiError) {
    ResponseUtils.fail(res, err.message, err.statusCode, err.errors);
    return;
  }

  ResponseUtils.fail(res, errorConfig.INTERNAL_SERVER_ERROR.message, 500, []);
};
