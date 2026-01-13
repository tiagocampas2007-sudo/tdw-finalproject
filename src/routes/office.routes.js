import express from "express";
import {
  createOffice,
  getAllOffices,
  updateOffice,
  deleteOffice
} from "../controllers/office.controller.js";

const router = express.Router();

router.post("/", createOffice);          
router.get("/", getAllOffices);          
router.put("/:officeId", updateOffice);  
router.delete("/:officeId", deleteOffice); 

export default router;
