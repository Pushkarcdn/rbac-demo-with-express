const getIO = async () => {
  const module = await import("../../../index.js");
  return module.io;
};

export const notifyAllClients = async (eventType, data) => {
  try {
    const io = await getIO();
    io.emit(eventType, {
      message: data.message || "Update notification",
      timestamp: new Date().toISOString(),
      ...data,
    });
  } catch (error) {
    console.error("Error sending WebSocket notification:", error);
  }
};

export const notifyRoom = async (room, eventType, data) => {
  try {
    const io = await getIO();
    io.to(room).emit(eventType, {
      message: data.message || "Update notification",
      timestamp: new Date().toISOString(),
      ...data,
    });
  } catch (error) {
    console.error("Error sending WebSocket room notification:", error);
  }
};
