/**
 * @author: Sajid Mujawar
 */

import type { IUser } from "../../interfaces/base/types.d.ts";
import type { FilterQuery } from "mongoose";
import { userRepository } from "../../repository/index.ts";

class UserService {
  async getAllUser(search: string, currentUserId: string) {
    const searchQuery: FilterQuery<IUser> = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const users = await userRepository.getAllUsersWithoutCurrentUser(searchQuery, currentUserId);

    return users;
  }
}

export default new UserService();
