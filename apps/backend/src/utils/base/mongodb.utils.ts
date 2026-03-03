import mongoose from "mongoose";
import { envConfig } from "../../config/index.ts";

/**
 * Connects to MongoDB using Mongoose.
 */

class DatabaseUtils {

    static connectDB = async (): Promise<void> => {
        try {
            if (!envConfig.requiredEnvVariables.DATABASE_URL) {
                throw new Error("MONGO_URI environment variable is not defined");
            }

            await mongoose.connect(envConfig.requiredEnvVariables.DATABASE_URL);

            console.warn("MongoDB connected successfully");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1); // Exit process with failure
        }
    };
}

export default DatabaseUtils;