import Office from "../models/Office.js";

// Create
export const createOffice = async (req, res) => {
  try {
    const { id, name, location, contact, openingHours, closingHours } = req.body;
    const office = await Office.create({ id, name, location, contact, openingHours, closingHours });
    res.status(201).json(office);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List
export const getAllOffices = async (req, res) => {
  try {
    const offices = await Office.find();
    res.json(offices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update
export const updateOffice = async (req, res) => {
  try {
    const { officeId } = req.params;
    const updated = await Office.findOneAndUpdate({ id: officeId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Office not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete
export const deleteOffice = async (req, res) => {
  try {
    const { officeId } = req.params;
    const deleted = await Office.findOneAndDelete({ id: officeId });
    if (!deleted) return res.status(404).json({ error: "Office not found" });
    res.json({ message: "Office deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
