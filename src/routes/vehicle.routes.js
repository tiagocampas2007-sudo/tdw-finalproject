import express from "express";
import {
  createVehicle,
  getVehiclesByClient,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicle.controller.js";

const router = express.Router();

// AJOUTE CETTE LIGNE pour /api/vehicles
router.get("/", (req, res) => {
  res.json([]); // temporairement vide
});

router.post("/", createVehicle);
router.get("/client/:clientId", getVehiclesByClient);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
