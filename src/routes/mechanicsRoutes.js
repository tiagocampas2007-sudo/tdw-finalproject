import express from "express";
const router = express.Router();

router.get("/hire-notification", (req, res) => {
  res.json({ hasPendingHire: false, notifications: [] });
});

export default router;
