import app from "./app.js";
import { server } from "./src/configs/env.config.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupWebSocketMiddleware } from "./src/middlewares/websocket.middleware.js";

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Set up WebSocket middleware for authentication and connection management
setupWebSocketMiddleware(io);

try {
  httpServer.listen(server.port, "0.0.0.0", (err) => {
    if (err) {
      console.error(
        `\nError starting the server on port ${server.port}:\n${err}\n`,
      );
      return;
    }

    console.info(`===========================================`);
    console.info(`======= Environment: ${process.env.NODE_ENV} ========`);
    console.info(`🚀 App listening on the port ${server.port}`);
    console.info(`🔌 WebSocket server is running`);
    console.info(`===========================================`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
}
