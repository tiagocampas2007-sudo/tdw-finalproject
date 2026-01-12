import mongoose from "mongoose";

const vehicleStatusSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    notes: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("VehicleStatus", vehicleStatusSchema);
