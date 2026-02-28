/**
 * @author: Sajid Mujawar
 */

import { Errors } from "../../error/index.ts";
import type { IUser } from "../../interfaces/types.d.js";
import { userRepository } from "../../repository/index.ts";
import authUtils from "../../utils/auth.utils.ts";

class AuthService {
  async register(email: string, password: string, pic: string, name: string) {
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
      throw new Errors.ConflictError("User already exists");
    }

    const hashedPassword = await authUtils.hashPassword(password);

    const userData: Partial<IUser> = {
      email,
      password: hashedPassword,
      name,
    };

    if (pic && pic.trim() !== "") {
      userData.pic = pic;
    }

    const newUser = await userRepository.createUser(userData);

    return newUser;
  }

  async login(email: string, password: string) {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new Errors.UnauthorizedError("Invalid email or password");
    }

    const isMatch = await authUtils.comparePasswords(password, user.password);
    if (!isMatch) {
      throw new Errors.UnauthorizedError("Invalid email or password");
    }

    const token = authUtils.generateToken(user._id.toString(), user.email);

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      pic: user.pic,
      token,
    };
  }


}

export default new AuthService();
