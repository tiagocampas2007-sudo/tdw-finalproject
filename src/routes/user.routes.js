import express from "express";
import { 
  getMyProfile, 
  login, 
  updateMyProfile, 
  applyMechanic,
  logout 
} from "../controllers/user.controller.js";

const router = express.Router();

// 🔐 AUTENTICAÇÃO
router.post("/login", login);
router.post("/logout", logout);

// 👤 PERFIL (precisa token)
router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.post("/mechanic/apply", applyMechanic);

export default router;
