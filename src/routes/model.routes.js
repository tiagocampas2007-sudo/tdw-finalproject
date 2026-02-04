import express from "express";
import { getModels, deleteModel, createModels } from "../controllers/model.controller.js";  // ← + createModels

const router = express.Router();

router.post("/", createModels);     // ← AJOUTE ÇA pour Postman !
router.get("/", getModels);
router.delete("/:id", deleteModel);

export default router;
