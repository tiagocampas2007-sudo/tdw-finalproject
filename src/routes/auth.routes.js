import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js"; 

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);  

router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logout realizado com sucesso" });
});

export default router;
