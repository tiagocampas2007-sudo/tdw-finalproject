// mechanicsRoutes.js (COMPLETO)
import express from "express";
import {
  createMechanic,
  updateMechanic,
  deleteMechanic,
  applyMechanic,
  getMechanicsByOffice
} from "../controllers/mechanic.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ✅ ROTA CRÍTICA PRIMEIRA (resolve 404)
router.get("/by-office", authMiddleware, getMechanicsByOffice);

// ✅ Rotas restantes
router.post("/apply", authMiddleware, applyMechanic);
router.post("/", createMechanic);
router.put("/:mechanicId", authMiddleware, updateMechanic);
router.delete("/:mechanicId", authMiddleware, deleteMechanic);
router.get("/hire-notification", (req, res) => {
  res.json({ hasPendingHire: false, notifications: [] });
});

export default router;
