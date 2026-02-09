// routes/service.routes.js - CORRIGIDO COMPLETO (Português PT)
import express from "express";
import {
  createService,
  updateService,
  deleteService,
  getServicesByOffice,
  getServices,
  getOfficeServices  // ← IMPORT NOVA FUNÇÃO
} from "../controllers/service.controller.js";

import authMiddleware from "../middleware/auth.js";  // ← IMPORTA MIDDLEWARE

const router = express.Router();

// 🔥 RESOLVE 404: Serviços da oficina do user logado (ADMIN)
router.get("/office", authMiddleware, getOfficeServices);  // ← NOVA ROTA!

// Rotas existentes (mantém iguais)
router.get("/", getServices);  // Lista todos
router.post("/", authMiddleware, createService);  
router.put("/:serviceId", authMiddleware, updateService);  
router.delete("/:serviceId", authMiddleware, deleteService);  
router.get("/office/:officeId", getServicesByOffice);  // Por officeId específico

export default router;
