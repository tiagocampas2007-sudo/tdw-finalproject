// models/Mechanic.js
import mongoose from "mongoose";

const mechanicSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    userId: {
      type: Number, // FK 
      ref: "User",
      required: true
    },
    officeId: {
      type: Number, // FK 
      ref: "Office",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Mechanic", mechanicSchema);
