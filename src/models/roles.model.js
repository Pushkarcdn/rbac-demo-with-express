import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

// Create model
const Roles = mongoose.models.Roles || mongoose.model("Roles", roleSchema);

export default Roles;
