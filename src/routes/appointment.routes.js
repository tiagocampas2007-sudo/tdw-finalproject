import express from "express";
import { 
  checkAvailability, 
  createAppointment,
  getMyAppointments  // ← AJOUTÉ
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/availability", checkAvailability);      // ✅ Slots
router.post("/", createAppointment);                 // ✅ Créer
router.get("/my-appointments", getMyAppointments);   // ✅ Liste perso

export default router;
