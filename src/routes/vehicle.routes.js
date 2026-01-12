import express from "express";
import {
  createVehicle,
  getVehiclesByClient,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicle.controller.js";

const router = express.Router();

router.post("/", createVehicle);
router.get("/client/:clientId", getVehiclesByClient);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
