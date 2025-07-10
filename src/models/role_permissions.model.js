import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema(
  {
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
      required: true,
    },
    permission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permissions",
      required: true,
    },
  },
  { timestamps: true },
);

const Role_Permissions =
  mongoose.models.Role_Permissions ||
  mongoose.model("Role_Permissions", rolePermissionSchema);

export default Role_Permissions;
