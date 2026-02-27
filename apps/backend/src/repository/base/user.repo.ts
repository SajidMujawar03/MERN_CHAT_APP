
import { IUser } from "../../interfaces/types.d.js";
import { User } from "../../models/index.ts";

class UserRepository {
    async populateUser<T>(path: string, select: string, document: T) {
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
}

export default new UserRepository();