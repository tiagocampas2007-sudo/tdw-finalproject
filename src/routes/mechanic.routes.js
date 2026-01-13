import express from "express";
import {
  createMechanic,
  updateMechanic,
  deleteMechanic
} from "../controllers/mechanic.controller.js";

const router = express.Router();

router.post("/", createMechanic);              
router.put("/:mechanicId", updateMechanic);    
router.delete("/:mechanicId", deleteMechanic); 

export default router;
