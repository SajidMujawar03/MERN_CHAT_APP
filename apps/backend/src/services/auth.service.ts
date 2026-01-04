import {
  ConflictError,
  UnauthorizedError,
} from "../error/error";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/types";

class AuthService {
  async register(email: string, password: string, pic: string, name: string) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare the user object dynamically
    const userData: Partial<IUser> = {
      email,
      password: hashedPassword,
      name,
    };

    if (pic && pic.trim() !== "") {
      userData.pic = pic; // only add pic if it’s not empty
    }

    const newUser = await User.create(userData);

    return newUser;
  }

  async login(email: string, password: string) {
    const user = (await User.findOne({ email })) as IUser;

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = this.generateToken(user._id.toString(), user.email);

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      pic: user.pic,
      token,
    };
  }

  generateToken(_id: string, email: string) {
    return jwt.sign(
      { _id: _id, email: email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "10d" }
    );
  }
}

export default new AuthService();
