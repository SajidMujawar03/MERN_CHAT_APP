/**
 * @author: Sajid Mujawar
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.ts";

class AuthUtils {
    generateToken(_id: string, email: string) {
        return jwt.sign(
            { _id: _id, email: email },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: "10d" },
        );
    }

    async comparePasswords(plainPassword: string, hashedPassword: string) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    verifyToken(token: string): jwt.JwtPayload {
        return jwt.verify(token, config.envConfig.requiredEnvVariables.JWT_SECRET_KEY) as jwt.JwtPayload;
    }
}

export default new AuthUtils();