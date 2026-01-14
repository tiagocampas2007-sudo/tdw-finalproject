import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
    },
  },
  { collection: "user_roles" }
);

export default mongoose.model("UserRole", userRoleSchema);