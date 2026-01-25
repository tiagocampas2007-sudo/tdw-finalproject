import Model from "../models/Model.js";

// GET /api/models
export const getModels = async (req, res) => {
  try {
    const models = await Model.find().lean(); // lean() para JSON puro
    const formatted = models.map(m => ({
      ...m,
      brandId: m.brandId.toString() // garante string para comparação
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar modelos" });
  }
};

// DELETE /api/models/:id
export const deleteModel = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Modelo não encontrado" });
    res.json({ message: "Modelo removido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao remover modelo" });
  }
};
