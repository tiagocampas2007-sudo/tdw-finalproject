import express from "express";
import {
  getMyVehicles,
  createVehicle,
  getVehiclesByClient,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicle.controller.js";

const router = express.Router();

router.get("/", getMyVehicles);
router.post("/", createVehicle);
router.get("/client/:clientId", getVehiclesByClient);
router.put("/:id", updateVehicle);     // ✅ :id = "1", "2"...
router.delete("/:id", deleteVehicle);  // ✅ :id = "1", "2"...

export default router;
