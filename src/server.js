import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";  // ✅ IMPORT cookie-parser

import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

// ✅ 1. dotenv AVANT tout
dotenv.config();

// ✅ 2. app = PREMIÈRE chose
const app = express();

// ✅ 3. MIDDLEWARES DANS L'ORDRE
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());  // ✅ APRÈS app !

// ✅ 4. Routes APRÈS middlewares
app.use("/api", routes);

// ✅ 5. Route test
app.get("/", (req, res) => {
  res.json({ message: "Servidor a funcionar" });
});

const PORT = 4000;

// ✅ 6. Fonction start OK
async function start() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
  });
}

start();
