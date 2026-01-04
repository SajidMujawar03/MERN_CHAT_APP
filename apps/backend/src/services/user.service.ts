import { IUser } from "../interfaces/types";
import { User } from "../models/user.model";
// import { IUser } from "../types";
import { FilterQuery } from "mongoose";

class UserService {
  async getAllUser(search: string,currentUserId:string) {

    const searchQuery: FilterQuery<IUser> =search? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }:{};
 
  

    const users =await User.find(searchQuery).find({_id:{$ne:currentUserId}}).select("-password")


    return users

  }
}

export default new UserService();
