// controllers/serviceController.js - FICHEIRO COMPLETO CORRIGIDO
import Service from "../models/Service.js";
import User from "../models/User.js";


// 🔥 GET /api/services/office - Serviços da oficina do user logado
export const getOfficeServices = async (req, res) => {
  try {
    console.log("🔧 GET serviços da oficina do user:", req.user?.uid);
    
    // Pega user logado (deve ser ADMIN de oficina)
    const user = await User.findById(req.user.uid).populate("office");
    if (!user?.office) {
      return res.status(404).json({ erro: "Oficina não encontrada" });
    }

    console.log("🔍 Oficina do user:", user.office._id);
    
    // Busca serviços DESSA oficina
    const services = await Service.find({ officeId: user.office._id });
    
    // Formato frontend
    const formattedServices = services.map(service => ({
      _id: service._id,
      name: service.name,
      office: { 
        name: user.office.name,  // Nome real da oficina
        _id: user.office._id 
      },
      description: service.description || '',
      durationMinutes: service.durationMinutes || 60,
      price: service.price || 50,
      serviceTypeId: { slug: 'default' }
    }));
    
    console.log("✅ Enviando", formattedServices.length, "serviços");
    res.json(formattedServices);
    
  } catch (err) {
    console.error("❌ Erro getOfficeServices:", err);
    res.status(500).json({ erro: err.message });
  }
};


// Listar TODOS os serviços (público)
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    
    const formattedServices = services.map(service => ({
      _id: service._id,
      name: service.name,
      office: { 
        name: `Oficina ${service.officeId}`, 
        _id: service.officeId 
      },
      description: service.description || '',
      durationMinutes: service.durationMinutes || 60,
      price: service.price || 50,
      serviceTypeId: { slug: 'default' }
    }));
    
    res.json(formattedServices);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


// Criar serviço
export const createService = async (req, res) => {
  try {
    const { id, officeId, name, durationMinutes, price, description } = req.body;
    
    // 🔥 Verifica se user é da oficina
    const user = await User.findById(req.user.uid);
    if (user.office.toString() !== officeId) {
      return res.status(403).json({ erro: "Não autorizado para esta oficina" });
    }
    
    const service = await Service.create({ 
      id, 
      officeId, 
      name, 
      durationMinutes, 
      price, 
      description 
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


// Atualizar serviço
export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const service = await Service.findOne({ id: serviceId });
    if (!service) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }
    
    // Verifica autorização
    const user = await User.findById(req.user.uid);
    if (service.officeId !== user.office.toString()) {
      return res.status(403).json({ erro: "Não autorizado" });
    }
    
    const updated = await Service.findOneAndUpdate(
      { id: serviceId }, 
      req.body, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


// Eliminar serviço
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const service = await Service.findOne({ id: serviceId });
    if (!service) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }
    
    const user = await User.findById(req.user.uid);
    if (service.officeId !== user.office.toString()) {
      return res.status(403).json({ erro: "Não autorizado" });
    }
    
    await Service.findOneAndDelete({ id: serviceId });
    res.json({ mensagem: "Serviço eliminado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


// Listar serviços por escritório (público)
export const getServicesByOffice = async (req, res) => {
  try {
    const { officeId } = req.params;
    const services = await Service.find({ officeId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
