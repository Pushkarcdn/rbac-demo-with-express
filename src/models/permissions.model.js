import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    permission_name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Permissions =
  mongoose.models.Permissions ||
  mongoose.model("Permissions", permissionSchema);

export default Permissions;
