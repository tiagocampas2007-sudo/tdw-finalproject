import Model from "../models/Model.js";
import Brand from "../models/Brand.js";

// ✅ getModels (CORRIGIDO 100% - aceita NÚMERO ou ObjectId)
export const getModels = async (req, res) => {
  try {
    const { brandId } = req.query;
    
    console.log(`🔍 brandId recebido: "${brandId}"`);
    
    // ✅ PASSO 1: Pega TODOS os modelos
    let models = await Model.find({})
      .populate("brandId", "name image slug id")
      .lean();
    
    // ✅ PASSO 2: Se tem brandId → FILTRA no JS (SEM MongoDB query)
    if (brandId) {
      console.log(`🔍 Filtrando por brandId: ${brandId}`);
      
      models = models.filter(model => {
        // Aceita número OU ObjectId
        return model.brandId?.id == brandId || 
               model.brandId?._id?.toString() === brandId;
      });
      
      console.log(`🔍 ${models.length} modelos filtrados`);
    }
    
    // ✅ PASSO 3: Formata para frontend
    const formatted = models.map(model => ({
      id: model.id,
      name: model.name,
      slug: model.slug,
      image: model.image,
      brandId: model.brandId?._id?.toString(),
      brand: model.brandId
    }));
    
    console.log(`✅ Enviando ${formatted.length} modelos`);
    res.json(formatted);
    
  } catch (err) {
    console.error("🚨 ERRO:", err.message);
    res.status(500).json({ error: err.message });
  }
};



// ✅ getModelsByBrand (MESMA LÓGICA)
export const getModelsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    
    console.log(`🔍 getModelsByBrand - brandId: "${brandId}"`);
    
    let query = {};
    if (!isNaN(brandId) && brandId.length < 24) {
      query = { "brandId.id": Number(brandId) };
    } else {
      query = { brandId };
    }
    
    const models = await Model.find(query)
      .populate("brandId", "name image slug id")
      .lean();
    
    console.log(`✅ ${models.length} modelos encontrados`);
    res.json(models);
    
  } catch (err) {
    console.error("🚨 ERRO getModelsByBrand:", err.message);
    res.status(500).json({ message: "Erro ao buscar modelos por marca", error: err.message });
  }
};

// deleteModel e createModels iguais...
export const deleteModel = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Model.findOneAndDelete({ id: Number(id) });
    if (!deleted) return res.status(404).json({ message: "Modelo não encontrado" });
    res.json({ message: "Modelo removido com sucesso!" });
  } catch (err) {
    console.error("❌ deleteModel:", err);
    res.status(500).json({ message: "Erro ao remover modelo" });
  }
};

export const createModels = async (req, res) => {
  try {
    const models = req.body;
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
    console.error("🚨 createModels:", err);
    res.status(500).json({ error: err.message });
  }
};
