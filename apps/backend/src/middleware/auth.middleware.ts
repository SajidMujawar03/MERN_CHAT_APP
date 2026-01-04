import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../error/error";

class AuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("No token provided");
      }

      const token = authHeader.split(" ")[1];

      const secret = process.env.JWT_SECRET_KEY!;

      const decoded = jwt.verify(token, secret) as JwtPayload;

      req.user = { _id: decoded._id, email: decoded.email };

      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        next(new UnauthorizedError("Invalid or expired token"));
      } else {
        next(error);
      }
    }
  }
}

export default new AuthMiddleware();
