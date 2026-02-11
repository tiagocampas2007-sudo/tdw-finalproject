// controllers/serviceController.js - FICHEIRO COMPLETO CORRIGIDO
import Service from "../models/Service.js";
import User from "../models/User.js";

// 🔥 GET /api/services/office - Serviços da oficina do user logado
// 🔥 GET /api/services/office - CORRIGIDO
export const getOfficeServices = async (req, res) => {
  try {
    console.log('👤 req.user:', req.user);
    
    const officeObjectId = req.user?.office;
    
    if (!officeObjectId) {
      return res.status(400).json({ erro: "Utilizador sem oficina associada" });
    }

    // ✅ BUSCA a oficina para validar e pegar o NUMBER id
    const office = await Office.findById(officeObjectId);
    if (!office) {
      return res.status(404).json({ erro: "Oficina não encontrada" });
    }

    const officeIdNumber = office.id;  // ← 1770842299574 (NUMBER!)
    
    console.log('🏢 officeId NUMBER:', officeIdNumber);
    
    const services = await Service.find({ officeId: officeIdNumber });
    console.log(`✅ ${services.length} serviços encontrados`);
    
    res.json(services);
    
  } catch (err) {
    console.error("❌ ERRO:", err);
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
