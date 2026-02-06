import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    serviceId: { type: String, required: true },     // ← String (Mongo ObjectId)
    officeId: { type: Number, required: true },
    userId: { type: Number },
    date: { type: Date, required: true },
    time: { type: Number, required: true }, 
    durationMinutes: { type: Number, required: true },
    status: { type: String, default: "PENDING" }     // ← PENDING (pas "confirmado")
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
