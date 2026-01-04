import { Document, Types } from "mongoose";

export interface IChat extends Document {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[]; // array of user IDs
  latestMessage?: Types.ObjectId; // optional latest message
  groupAdmin?: Types.ObjectId;
}

export interface IMessage extends Document {
  content: string;
  sender: Types.ObjectId;
  chat: Types.ObjectId;
}

export interface IUser extends Document {
  _id:string;
  name:string;
  pic?:string;
  email:string;
  password:string;
}
