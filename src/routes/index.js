import express from "express";

import brandRoutes from "./brand.routes.js";
import authRoutes from "./auth.routes.js";
import modelRoutes from "./model.routes.js";
import vehicleRoutes from "./vehicle.routes.js";     
import officeRoutes from "./office.routes.js";       
import mechanicsRoutes from "./mechanicsRoutes.js";
import userRoutes from "./user.routes.js";           
import serviceRoutes from "./service.routes.js";
import appointmentsRoutes from "./appointment.routes.js";  

const router = express.Router();

router.use("/appointments", appointmentsRoutes);  
router.use("/services", serviceRoutes);  
router.use("/brands", brandRoutes);
router.use("/auth", authRoutes);
router.use("/models", modelRoutes);
router.use("/vehicles", vehicleRoutes);  
router.use("/offices", officeRoutes);     
router.use("/mechanics", mechanicsRoutes);
router.use("/users", userRoutes);

export default router;
