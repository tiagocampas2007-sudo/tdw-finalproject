import express from "express";
import { getBrands } from "../controllers/brand.controller.js";

const router = express.Router();

router.get("/", getBrands);

export default router;
