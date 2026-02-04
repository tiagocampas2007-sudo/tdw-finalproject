import Brand from "../models/Brand.js";

// ✅ GET (ton code parfait)
export async function getBrands(req, res) {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    console.error("Brands ERROR:", error);
    res.status(500).json({ message: "Erro ao obter marcas" });
  }
}

// ✅ POST (Nouveau - pour Postman)
export async function createBrands(req, res) {
  try {
    const brands = req.body;
    await Brand.deleteMany({});  // Nettoie d'abord
    const created = await Brand.insertMany(brands);
    
    res.status(201).json({
      message: "✅ Marcas criadas!",
      count: created.length
    });
  } catch (error) {
    console.error("Create Brands ERROR:", error);
    res.status(500).json({ message: "Erro ao criar marcas" });
  }
}
