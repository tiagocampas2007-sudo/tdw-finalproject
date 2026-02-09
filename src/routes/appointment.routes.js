import express from "express";
import { 
  checkAvailability, 
  createAppointment,
  getMyAppointments,
  getOfficeAppointments  // ← IMPORT FALTAVA (resolve 404)
} from "../controllers/appointment.controller.js";

import authMiddleware from "../middleware/auth.js";  // ← IMPORT FALTAVA

const router = express.Router();

// ✅ Rotas públicas
router.post("/availability", checkAvailability);     // Verificar horários
router.post("/", createAppointment);                 // Criar marcação

// ✅ Rotas PROTEGIDAS
router.get("/my-appointments", authMiddleware, getMyAppointments);      // Minhas marcações
router.get("/office-appointments", authMiddleware, getOfficeAppointments);  // ← RESOLVE 404!

export default router;
