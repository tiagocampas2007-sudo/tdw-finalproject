import express from "express";
import {
  getMyVehicles,      // ← AJOUTÉ ! OBLIGATOIRE
  createVehicle,
  getVehiclesByClient,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicle.controller.js";

const router = express.Router();

// ✅ REMPLACE la ligne temporaire vide par ÇA
router.get("/", getMyVehicles);  // ← /api/vehicles → getMyVehicles (20 voitures)

// Autres routes
router.post("/", createVehicle);
router.get("/client/:clientId", getVehiclesByClient);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
