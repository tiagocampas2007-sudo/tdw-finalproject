import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI não definida");
    }

    await mongoose.connect(uri);

    console.log("MongoDB ligado com sucesso");
  } catch (error) {
    console.error("Erro ao ligar MongoDB:", error.message);
    process.exit(1);
  }
}