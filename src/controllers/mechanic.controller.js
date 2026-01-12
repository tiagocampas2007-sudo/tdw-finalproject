// controllers/mechanicController.js
import Mechanic from "../models/Mechanic.js";

// Create
export const createMechanic = async (req, res) => {
  try {
    const { id, userId, officeId } = req.body;
    const mechanic = await Mechanic.create({ id, userId, officeId });
    res.status(201).json(mechanic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update
export const updateMechanic = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    const updated = await Mechanic.findOneAndUpdate({ id: mechanicId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Mechanic not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete
export const deleteMechanic = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    const deleted = await Mechanic.findOneAndDelete({ id: mechanicId });
    if (!deleted) return res.status(404).json({ error: "Mechanic not found" });
    res.json({ message: "Mechanic deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
