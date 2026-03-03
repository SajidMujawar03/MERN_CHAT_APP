import type { Response } from "express";

class ResponseUtils {
  static success(
    res: Response,
    data: unknown = null,
    message = "Success",
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
      errors: null
    });
  }

  static fail(
    res: Response,
    message = "Error",
    statusCode = 500,
    errors: any[] = [],
  ) {
    return res.status(statusCode).json({
      status: "error",
      message,
      data: null,
      errors,
    });
  }

}

export default ResponseUtils;
