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
    console.log("📥 Recebido:", req.body.length, "modelos");
    
    const models = req.body;
    await Model.deleteMany({});
    
    // ✅ SI ton JSON a déjà brandId → utilise direct
    const created = await Model.insertMany(models);
    
    console.log("✅ Criados:", created.length, "modelos");
    
    res.status(201).json({
      message: "✅ Modelos criados!",
      count: created.length,
      models: created.map(m => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        brandId: m.brandId
      }))
    });
  } catch (err) {
    console.error("🚨 CREATE MODELS ERROR:", err.message);
    res.status(500).json({ 
      message: "Erro ao criar modelos",
      error: err.message 
    });
  }
};
