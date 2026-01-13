import express from "express";
import {
  createService,
  updateService,
  deleteService,
  getServicesByOffice
} from "../controllers/service.controller.js";

const router = express.Router();

router.post("/", createService);                    
router.put("/:serviceId", updateService);           
router.delete("/:serviceId", deleteService);        
router.get("/office/:officeId", getServicesByOffice); 

export default router;
