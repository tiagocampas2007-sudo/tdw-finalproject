import express from "express";
import {
  createService,
  updateService,
  deleteService,
  getServicesByOffice,
  getServices  // ← AJOUTE ÇA
} from "../controllers/service.controller.js";

const router = express.Router();

// 🔥 LECTURE DE TES DONNÉES MONGODB
router.get("/", getServices);

router.post("/", createService);                    
router.put("/:serviceId", updateService);          
router.delete("/:serviceId", deleteService);       
router.get("/office/:officeId", getServicesByOffice); 

export default router;
