import { NextFunction, Response, Request } from "express";
import { ZodError, ZodType } from "zod";

class ValidationMiddleware {
  static zodValidate =
    <T>(schema: ZodType<T>) =>
      (req: Request, res: Response, next: NextFunction) => {
        try {
          const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
          });

          if (parsed && typeof parsed === "object") {
            if ("body" in parsed) req.body = parsed.body;
            if ("query" in parsed) req.query = parsed.query as any;
            if ("params" in parsed) req.params = parsed.params as any;
          }

          next();
        } catch (err) {
          if (err instanceof ZodError) {
            
            return res.status(400).json({
              message: "Validation Failed",
              success: false,
              errors: err.issues,
            });
          }
          next(err);
        }
      };
}

export default ValidationMiddleware;
