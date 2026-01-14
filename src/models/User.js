import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserRole",
        required: true,
    },

    office: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office",
        required: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
