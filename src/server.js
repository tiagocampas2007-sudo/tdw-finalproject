import express from "express";
import { connectDB } from "./config/db.js";

import brandRoutes from "./routes/brand.routes.js";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/brands", brandRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Servidor a funcionar" });
});

const PORT = 4000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
  });
}

start();