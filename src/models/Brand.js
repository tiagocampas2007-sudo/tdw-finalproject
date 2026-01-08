import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
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
    slug: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);