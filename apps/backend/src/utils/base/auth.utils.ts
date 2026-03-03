/**
 * @author: Sajid Mujawar
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { constantConfig,  envConfig } from "../../config/index.ts";

class AuthUtils {
    static generateToken(_id: string, email: string) {
        return jwt.sign(
            { _id: _id, email: email },
            envConfig.requiredEnvVariables.JWT_SECRET_KEY,
            { expiresIn: constantConfig.JWT_EXPIRES_IN },
        );
    }

    static async comparePasswords(plainPassword: string, hashedPassword: string) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async hashPassword(password: string) {
        return await bcrypt.hash(password, constantConfig.BCRYPT_SALT_ROUNDS);
    }

    static verifyToken(token: string): jwt.JwtPayload {
        return jwt.verify(token, envConfig.requiredEnvVariables.JWT_SECRET_KEY) as jwt.JwtPayload;
    }
}

export default AuthUtils;