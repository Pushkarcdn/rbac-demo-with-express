import redisClient from "./redis.js";
import models from "../models/index.js";

const { audit_logs } = models;

// Queue name for audit logs
const AUDIT_QUEUE = "audit_logs_queue";

export const logAuditEvent = async (auditData) => {
  try {
    // Add to Redis queue
    await redisClient.lPush(AUDIT_QUEUE, JSON.stringify(auditData));

    // Process immediately for this implementation
    // In a production environment, you might want to process this in a separate worker
    processAuditQueue();
  } catch (error) {
    console.error("Error logging audit event:", error);
  }
};

export const processAuditQueue = async () => {
  try {
    // Get all items from the queue (up to 100 at a time)
    const queueItems = await redisClient.lRange(AUDIT_QUEUE, 0, 99);

    if (queueItems.length === 0) return;

    // Process each item
    const bulkOps = queueItems.map((item) => {
      const auditData = JSON.parse(item);
      return new audit_logs(auditData);
    });

    // Save to database
    await audit_logs.insertMany(bulkOps);

    // Remove processed items from the queue
    await redisClient.lTrim(AUDIT_QUEUE, queueItems.length, -1);
  } catch (error) {
    console.error("Error processing audit queue:", error);
  }
};

/**
 * Start the audit queue processor
 * This will process the queue every 5 seconds
 */
export const startAuditQueueProcessor = () => {
  // Process the queue every 5 seconds
  setInterval(processAuditQueue, 5000);
  console.log("Audit queue processor starte!");
};

export default {
  logAuditEvent,
  processAuditQueue,
  startAuditQueueProcessor,
};
