import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "Username already exists!"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9]+$/,
        "Username must contain only letters and numbers!",
      ],
    },
    full_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
      required: true,
      onDelete: "CASCADE",
    },
  },
  { timestamps: true },
);

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);

export default Users;
