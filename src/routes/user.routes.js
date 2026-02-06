import express from "express";
import { getMyProfile } from "../controllers/user.controller.js";

const router = express.Router();

//  PARA "Ver Perfil"
router.get("/profile", getMyProfile);

export default router;
