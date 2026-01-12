// controllers/serviceController.js
import Service from "../models/Service.js";

// Create
export const createService = async (req, res) => {
  try {
    const { id, officeId, name, durationMinutes, price, description } = req.body;
    const service = await Service.create({ id, officeId, name, durationMinutes, price, description });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update
export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updated = await Service.findOneAndUpdate({ id: serviceId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Service not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const deleted = await Service.findOneAndDelete({ id: serviceId });
    if (!deleted) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List
export const getServicesByOffice = async (req, res) => {
  try {
    const { officeId } = req.params;
    const services = await Service.find({ officeId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
