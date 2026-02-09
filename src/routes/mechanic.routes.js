import express from "express";
import {
  createMechanic,
  updateMechanic,
  deleteMechanic,
  applyMechanic,
  getMechanicsByOffice  // ← IMPORT FALTAVA
} from "../controllers/mechanic.controller.js";

import authMiddleware from "../middlewares/auth.js";  // ← IMPORT FALTAVA

const router = express.Router();

// ✅ ROTA 1 - PRIMEIRA (resolve 404 /by-office)
router.get("/by-office", authMiddleware, getMechanicsByOffice);

// ✅ Rotas restantes
router.post("/apply", authMiddleware, applyMechanic);    
router.post("/", createMechanic);         
router.put("/:mechanicId", authMiddleware, updateMechanic);     
router.delete("/:mechanicId", authMiddleware, deleteMechanic); 

export default router;
