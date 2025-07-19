import mongoose from "mongoose";

const auditLogsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    event_type: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGOUT",
        "SIGNUP",
        "ACCESS_DENIED",
        "PERMISSION_CHANGE",
        "ROLE_CHANGE",
        "DATA_CHANGE",
        "OTHER",
      ],
    },
    resource: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip_address: {
      type: String,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILURE", "WARNING"],
      default: "SUCCESS",
    },
  },
  { timestamps: true },
);

// Create indexes for better query performance
auditLogsSchema.index({ user_id: 1, createdAt: -1 });
auditLogsSchema.index({ event_type: 1, createdAt: -1 });
auditLogsSchema.index({ createdAt: -1 });

const Audit_Logs =
  mongoose.models.Audit_Logs || mongoose.model("Audit_Logs", auditLogsSchema);

export default Audit_Logs;
