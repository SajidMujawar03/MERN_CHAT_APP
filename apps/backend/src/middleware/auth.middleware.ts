import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Errors } from "../error/index.ts";
import authUtils from "../utils/base/auth.utils.ts";

class AuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction) {
    const { JsonWebTokenError } = jwt;
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Errors.UnauthorizedError(["Missing token"]);
      }

      const token = authHeader.split(" ")[1];

      const decoded = authUtils.verifyToken(token);

      req.user = { _id: decoded._id, email: decoded.email };

      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        next(new Errors.UnauthorizedError(["Invalid/malformed token"]));
      } else {
        next(error);
      }
    }
  }
}

export default new AuthMiddleware();
