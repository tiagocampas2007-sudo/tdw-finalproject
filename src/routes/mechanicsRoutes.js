import express from "express";
const router = express.Router();

// ✅ ROTA ADICIONADA AQUI
router.post("/apply", (req, res) => {
  try {
    const payload = req.body;
    console.log("Candidatura recebida:", payload);
    
    // TODO: A tua lógica de guardado na base de dados
    // Por agora, resposta de teste
    res.json({ 
      message: "Candidatura enviada com sucesso", 
      mechanicId: "12345" 
    });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Rota existente (mantém-la)
router.get("/hire-notification", (req, res) => {
  res.json({ hasPendingHire: false, notifications: [] });
});

export default router;
