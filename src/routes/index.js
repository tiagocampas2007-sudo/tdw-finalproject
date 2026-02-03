import express from "express";
import authRoutes from "./auth.js";
import brandRoutes from "./brandRoutes.js"; 
import mechanicsRoutes from "./mechanicsRoutes.js";  

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/brands', brandRoutes);
router.use('/mechanics', mechanicsRoutes); 

export default router;
