import { createClient } from "redis";
import { redis } from "../configs/env.config.js";

// creating Redis client
const redisClient = createClient({
  username: redis.username,
  password: redis.password,
  socket: {
    host: redis.host,
    port: redis.port,
  },
});

// logging for debugging purposes
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

// connecting to Redis
await redisClient.connect();

// exporting redis client (imported by app.js to include it in request object)
export default redisClient;
