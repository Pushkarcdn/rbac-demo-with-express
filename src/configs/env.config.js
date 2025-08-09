import dotenv from "dotenv";

console.log(process.env.NODE_ENV || "not present");

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Server Configuration
export const server = {
  appName: process.env.APP_NAME,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  noOfProxies: process.env.NUMBER_OF_PROXIES,
  bodySizeLimit: process.env.REQUEST_BODY_SIZE_LIMIT,
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_TIME_WINDOW_IN_MINUTE,
    max: process.env.RATE_LIMIT_MAX_AMOUNT,
  },
};

// Frontend
export const frontend = {
  url: process.env.FRONTEND_URL,
};

// Backend
export const backend = {
  url: process.env.BACKEND_URL,
};

// JWT Token Configuration
export const jwtConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
};

//  Mailer Configuration
export const mailerConfig = {
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
};

// File Upload Configuration
export const fileStorage = {
  target: process.env.FILE_STORAGE_TARGET,
};

// Cloudinary Configuration
export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

// Database configuration
export const database = {
  mongoUri: process.env.MONGO_URI,
};

// Redis Configuration
export const redis = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};
