import Brand from "../models/Brand.js";

export async function getBrands(req, res) {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter marcas" });
  }
}