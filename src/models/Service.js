import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    officeId: {
      type: Number, 
      ref: "Office",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    durationMinutes: {
      type: Number
    },
    price: {
      type: Number
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
