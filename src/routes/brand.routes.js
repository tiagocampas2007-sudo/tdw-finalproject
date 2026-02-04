import express from "express";
import { getBrands, createBrands } from "../controllers/brand.controller.js";

const router = express.Router();

router.post("/", createBrands);

router.get("/", getBrands);

export default router;
