import express from "express";
import { 
  getModels, 
  getModelsByBrand, 
  deleteModel, 
  createModels 
} from "../controllers/model.controller.js";  // ✅ TODAS funções importadas!

const router = express.Router();

router.post("/", createModels);      // ✅ Postman
router.get("/", getModels);          // ✅ Todos modelos
router.delete("/:id", deleteModel);  // ✅ Apagar por ID numérico
router.get("/brand/:brandId", getModelsByBrand);  // ✅ Filtrar 

export default router;
