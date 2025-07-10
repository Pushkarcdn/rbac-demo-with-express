import rateLimit from "express-rate-limit";
import { server } from "./env.config.js";

// Rate limiting
export const limiter = rateLimit({
  windowMs: server.rateLimit.windowMs * 60 * 1000, // converting minutes to milliseconds
  max: server.rateLimit.max,
  message: {
    status: 429,
    message: "Too many requests from this IP, Please try again later!",
  },
});
