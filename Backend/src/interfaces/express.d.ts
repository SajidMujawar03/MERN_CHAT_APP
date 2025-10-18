
import * as express from "express";
import { IUser } from "./types";


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
