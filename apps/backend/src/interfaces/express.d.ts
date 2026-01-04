// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id:string;
        email:string
      }
    }

    interface Response {
      customMessage?: string;
    }
  }
}
