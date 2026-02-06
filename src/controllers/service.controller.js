// controllers/serviceController.js
import Service from "../models/Service.js";

// Listar TODOS os serviços (NOVO)
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    
    // Formato que o frontend ESPERA
    const formattedServices = services.map(service => ({
      _id: service._id,
      name: service.name,
      office: { 
        name: `Oficina ${service.officeId}`, // Fake name por agora
        _id: service.officeId 
      },
      description: service.description || '',
      durationMinutes: service.durationMinutes || 60,
      price: service.price || 50,
      serviceTypeId: { slug: 'default' }
    }));
    
    console.log("🔍 SERVICES:", formattedServices);
    res.json(formattedServices);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};




// Criar serviço
export const createService = async (req, res) => {
  try {
    const { id, officeId, name, durationMinutes, price, description } = req.body;
    const service = await Service.create({ id, officeId, name, durationMinutes, price, description });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Atualizar serviço
export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updated = await Service.findOneAndUpdate({ id: serviceId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ erro: "Serviço não encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Eliminar serviço
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const deleted = await Service.findOneAndDelete({ id: serviceId });
    if (!deleted) return res.status(404).json({ erro: "Serviço não encontrado" });
    res.json({ mensagem: "Serviço eliminado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Listar serviços por escritório
export const getServicesByOffice = async (req, res) => {
  try {
    const { officeId } = req.params;
    const services = await Service.find({ officeId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
