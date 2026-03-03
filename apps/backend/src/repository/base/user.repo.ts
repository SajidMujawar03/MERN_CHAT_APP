
import type { IUser } from "../../interfaces/base/types.d.ts";
import { User } from "../../models/index.ts";

class UserRepository {
    async populateByUser<T>(document: T, path: string, select?: string) {
        return await User.populate<T>(document, {
            path: path,
            select: select,
        })
    }

    async findUserByEmail(email: string) {
        return await User.findOne({
            email,
        });
    }

    async createUser(userData: Partial<IUser>) {
        return await User.create(userData);
    }

    async getAllUsersWithoutCurrentUser(searchQuery: object, currentUserId: string) {
        return await User.find({
            ...searchQuery,
            _id: { $ne: currentUserId },
        }).select("-password");
    }
}

export default new UserRepository();