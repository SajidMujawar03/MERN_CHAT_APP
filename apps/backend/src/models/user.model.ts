import mongoose from "mongoose";
import type { IUser } from "../interfaces/types";

const userSchema = new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
       
    }
    ,
    pic :{
        type:String,
         default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }
},{timestamps:true})

export const User=mongoose.model<IUser>("User",userSchema)