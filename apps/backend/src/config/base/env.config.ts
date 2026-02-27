import * as dotenv from 'dotenv';

dotenv.config();

type EnvConfig = {
  requiredEnvVariables: {
    PORT: string | number;
    DATABASE_URL: string;
    JWT_SECRET_KEY: string;
  }
}

const envConfig:EnvConfig = {
  requiredEnvVariables: {
    PORT: process.env.PORT ?? 5000,
    DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/mern-chat-app",
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "your_jwt_secret_key",
  } as const
} as const;

const checkEnvVariables = (): void => {
  const { requiredEnvVariables } = envConfig;
  for (const [key, value] of Object.entries(requiredEnvVariables)) {
    if (!value) {
      console.warn(`Warning: Environment variable ${key} is not defined.`);
    }
  }
}

export default {
  envConfig,
  checkEnvVariables
};