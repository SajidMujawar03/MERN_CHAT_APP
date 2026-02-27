import type { Request, Response, NextFunction } from "express";
import { Errors } from "../error/index.ts";


export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars*/
  _next: NextFunction,
): void => {
  if (err instanceof Errors.ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
