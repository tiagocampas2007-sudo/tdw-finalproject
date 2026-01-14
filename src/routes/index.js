import express from "express";

import brandRoutes from "./brand.routes.js";
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use("/brands", brandRoutes);
router.use("/auth", authRoutes);

export default router;