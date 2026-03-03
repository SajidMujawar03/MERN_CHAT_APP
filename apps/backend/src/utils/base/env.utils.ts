import { envConfig } from "../../config/index.ts";

class EnvUtils {
    static checkEnvVariables() {
        const { requiredEnvVariables } = envConfig;
        for (const [key, value] of Object.entries(requiredEnvVariables)) {
            if (!value) {
                console.warn(`Warning: Environment variable ${key} is not defined.`);
            }
        }
    }
}

export default EnvUtils;