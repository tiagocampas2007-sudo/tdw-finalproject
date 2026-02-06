import Model from "../models/Model.js";
import Brand from "../models/Brand.js";  // ← AJOUTÉ ! OBLIGATOIRE

// ✅ getModels (PARFAIT)
export const getModels = async (req, res) => {
  try {
    const models = await Model.find().lean();
    const formatted = models.map(m => ({
      ...m,
      brandId: m.brandId.toString()
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar modelos" });
  }
};

// ✅ deleteModel (PARFAIT)
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

// ✅ createModels CORRIGÉ
export const createModels = async (req, res) => {
  try {
    console.log("📦 BODY:", req.body);  // ← DIAGNOSTIC
    console.log("📦 LENGTH:", req.body.length);
    
    const models = req.body;
    
    // Validation rapide
    if (!Array.isArray(models) || models.length === 0) {
      return res.status(400).json({ error: "Array de modelos vazio" });
    }
    
    await Model.deleteMany({});
    const created = await Model.insertMany(models);
    
    res.status(201).json({
      message: "✅ Modelos criados!",
      count: created.length
    });
  } catch (err) {
    console.error("🚨 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

