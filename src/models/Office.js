import mongoose from "mongoose";

const officeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    contact: {
      type: String
    },
    openingHours: {
      type: String 
    },
    closingHours: {
      type: String 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Office", officeSchema);
