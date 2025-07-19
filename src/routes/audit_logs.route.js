import AuditLogsController from "../controllers/audit_logs/audit_logs.controller.js";

export default (router) => {
  router.get("/audit-logs", AuditLogsController.getAuditLogs);

  router.get("/audit-logs/user/:userId", AuditLogsController.getUserAuditLogs);
};
