import Model from "../models/Model.js";

export const getModels = async (req, res) => {
  try {
    const models = await Model.find();
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
