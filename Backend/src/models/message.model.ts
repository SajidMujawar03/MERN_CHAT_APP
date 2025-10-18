import mongoose from "mongoose";
import { IMessage } from "../interfaces/types";

const messageSchema=new mongoose.Schema<IMessage>(
    {
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        content:{
            type:String,
            trim:true
        },
        chat:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        }
    },
    {
        timestamps:true
    }
)


export const Message=mongoose.model<IMessage>("Message",messageSchema)