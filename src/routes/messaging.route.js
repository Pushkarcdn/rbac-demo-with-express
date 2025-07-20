// Don't import io directly to avoid circular dependency
// We'll get it from the app when the route is initialized

export default (router) => {
  // HTTP route to test WebSocket connection
  router.get("/websocket-test", (req, res) => {
    res.send({
      status: 200,
      message: "WebSocket server is running.",
      endpoint: "/socket.io",
    });
  });

  // Get the io instance from the main module
  const getIO = async () => {
    const module = await import("../../index.js");
    return module.io;
  };

  // Set up WebSocket event handlers when this route is loaded
  setTimeout(async () => {
    try {
      const io = await getIO();

      io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // When a user sends a message, broadcast it to all connected clients
        socket.on("message", (data) => {
          io.emit("message", {
            sender: socket.id,
            content: data,
            timestamp: new Date().toISOString(),
          });
        });

        // Allow users to join specific rooms
        socket.on("join-room", (room) => {
          socket.join(room);
          socket.to(room).emit("room-message", {
            type: "notification",
            content: `User ${socket.id} has joined the room`,
            timestamp: new Date().toISOString(),
          });
        });

        // Room-specific messages
        socket.on("room-message", ({ room, message }) => {
          io.to(room).emit("room-message", {
            sender: socket.id,
            content: message,
            room: room,
            timestamp: new Date().toISOString(),
          });
        });

        // Handle disconnect
        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
      });
    } catch (error) {
      console.error("Error setting up WebSocket handlers:", error);
    }
  }, 2000); // Small delay to ensure io is initialized

  return router;
};
