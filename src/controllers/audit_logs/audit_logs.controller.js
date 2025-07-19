import successResponse from "../../utils/responses/successResponse.js";
import models from "../../models/index.js";
import { authorizeUser } from "../../middlewares/auth.middleware.js";

const { audit_logs } = models;

const getAuditLogs = async (req, res, next) => {
  try {
    await authorizeUser(req, "view_audit_logs");

    const auditLogs = await audit_logs.find().sort({ createdAt: -1 }).populate({
      path: "user_id",
      select: "full_name username email",
      model: "Users",
    });

    return successResponse(
      res,
      auditLogs,
      "Audit logs fetched successfully!",
      "auditLogs",
    );
  } catch (error) {
    next(error);
  }
};

const getUserAuditLogs = async (req, res, next) => {
  try {
    await authorizeUser(req, "view_audit_logs");

    const { userId } = req.params;

    const auditLogs = await audit_logs
      .find({ user_id: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select: "full_name username email",
        model: "Users",
      });

    return successResponse(
      res,
      auditLogs,
      "User audit logs fetched successfully!",
      "auditLogs",
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getAuditLogs,
  getUserAuditLogs,
};
