import express from "express";

import brandRoutes from "./brand.routes.js";
import authRoutes from "./auth.routes.js";
import modelRoutes from "./model.routes.js";

const router = express.Router();

router.use("/brands", brandRoutes);
router.use("/auth", authRoutes);
router.use("/models", modelRoutes);

export default router;
