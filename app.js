import express from "express";
import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import httpContext from "express-http-context";
import redisClient from "./src/lib/redis.js";
import { startAuditQueueProcessor } from "./src/lib/auditLogger.js";

import { connectDB } from "./src/configs/database.config.js";
import routes from "./src/routes/index.js";
import upload from "./src/lib/multer.js";
import { server } from "./src/configs/env.config.js";

import authMiddleware from "./src/middlewares/auth.middleware.js";
import errorResponse from "./src/utils/responses/errorResponse.js";
import { frontend } from "./src/configs/env.config.js";
import { limiter } from "./src/configs/server.config.js";

const app = express();
const router = express.Router();

app.set("trust proxy", server.noOfProxies); // Trusting the Proxy (Cloudflare or Load Balancer)
app.set("view engine", "ejs"); // EJS as templating engine for rendering views
app.use(hpp()); // Against HTTP parameter pollution
app.use(helmet()); // Add security-related HTTP headers
app.use(express.json({ limit: server.bodySizeLimit })); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true, limit: server.bodySizeLimit })); // Parse URL-encoded data
app.use(compression()); // Enable response compression for faster API responses
app.use(cookieParser()); // Parse cookies from HTTP requests
app.use(httpContext.middleware); // Attach request-scoped data (context)

if (
  process.env.NODE_ENV === "local" ||
  process.env.NODE_ENV === "development"
) {
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
  );
  app.use(morgan("dev", {})); // Dev logging format
} else {
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
  );
  app.use(morgan("combined", {})); // More detailed logging for production
}

app.use(authMiddleware); // Global authentication middleware

app.use(upload); // Upload middleware

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "./public"))); // Serve static frontend files

// Middleware to attach redis client to request object
// So that it can be imported from anywhere through the request object
// mainly imported by auth.middleware.js using: req.redis
app.use((req, res, next) => {
  req.redis = redisClient;
  next();
});

connectDB();

// Start the audit queue processor
startAuditQueueProcessor();

// Home GET route
app.get("/", (req, res, next) => {
  try {
    res.send({
      status: 200,
      message: `The RBAC Demo with Express is active!`,
      source: "/ [GET]",
    });
  } catch (error) {
    next(error);
  }
});

// For test environment, registering routes directly
if (process.env.NODE_ENV === "test") {
  // Importing controllers only for test environment
  const SignupController = await import(
    "./src/controllers/auth/signup.controller.js"
  ).then((m) => m.default);
  const SigninController = await import(
    "./src/controllers/auth/signin.controller.js"
  ).then((m) => m.default);
  const SignoutController = await import(
    "./src/controllers/auth/signout.controller.js"
  ).then((m) => m.default);
  const ProfileController = await import(
    "./src/controllers/auth/profile.controller.js"
  ).then((m) => m.default);
  app.post("/api/auth/register", SignupController.registerUser);
  app.post("/api/auth/login", SigninController.loginUser);
  app.get("/api/auth/logout", SignoutController.logoutUser);
  app.get("/api/auth/me", ProfileController.currentUser);
} else {
  // For non-test environments, use the dynamic route loading
  app.use("/api", limiter, await routes(router));
}

/**
 * 404 Error Handler
 * If no route matches, respond with a 404 error.
 */
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = "Not Found";
  next(err);
});

/**
 * Global Error Handling Middleware
 * Handles all errors thrown in the app.
 */
app.use((err, req, res, next) => {
  try {
    let errorObj;

    const status = err?.status || 500;
    const path = req?.path || "-- Unknown Path --";
    const method = req?.method || "-- Unknown Method --";
    const message = err?.message || "Something went wrong!";
    const source = err?.source || `[${method}] ${path}`;
    const stack = err?.stack || "No stack trace available";

    console.error(
      `\n[${method}] ${path} >> StatusCode: ${status}, Message: ${message}`,
    );

    console.error(
      `${"-".repeat(100)} \nStack: ${stack} \n${"-".repeat(100)}\n`,
    );

    errorObj = errorResponse(status, message, source);

    return res.status(status).send(errorObj); // Send the error response as JSON
  } catch (error) {
    next(error); // In case of error in the error handler itself, call next middleware
  }
});

export default app;
