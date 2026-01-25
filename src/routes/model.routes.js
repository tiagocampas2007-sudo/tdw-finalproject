import express from "express";
import { getModels, deleteModel } from "../controllers/model.controller.js";

const router = express.Router();

router.get("/", getModels);
router.delete("/:id", deleteModel);

export default router;