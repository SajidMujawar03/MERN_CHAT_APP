import { Document, Types } from "mongoose";

export interface IChat extends Document {
  _id: String;
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[]; // array of user IDs
  latestMessage?: Types.ObjectId; // optional latest message
  groupAdmin?: Types.ObjectId;
}

export interface IMessage extends Document {
  content: String;
  sender: Types.ObjectId;
  chat: Types.ObjectId;
}

export interface IUser extends Document {
  _id: String;
  name: String;
  pic?: String;
  email: string;
  password: String;
}
