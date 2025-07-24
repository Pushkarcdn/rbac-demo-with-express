/**
 * WebSocket middleware to ensure connections are maintained
 * and to handle authentication for WebSocket connections
 */

import { verifyAccessToken } from "../lib/jwt.js";

export const setupWebSocketMiddleware = (io) => {
  io.use(async (socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie || "");
      const accessToken = cookies.accessToken;

      if (accessToken) {
        try {
          // Verify the token
          const payload = await verifyAccessToken(accessToken);
          // Attach user data to the socket
          socket.userId = payload.sub;
          socket.authenticated = true;
          next();
        } catch (error) {
          // Token verification failed, but still allow connection
          socket.authenticated = false;
          next();
        }
      } else {
        // No token, but still allow connection
        socket.authenticated = false;
        next();
      }
    } catch (error) {
      console.error("WebSocket authentication error:", error);
      socket.authenticated = false;
      next();
    }
  });
};

function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      const name = parts[0].trim();
      const value = parts.slice(1).join("=").trim();
      if (name) cookies[name] = value;
    });
  }
  return cookies;
}
