import Office from "../models/Office.js";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";

// ✅ Verificar disponibilidade (horários da oficina)
export const checkAvailability = async (req, res) => {
  try {
    const { officeId, date, durationMinutes = 60 } = req.body;
    
    const office = await Office.findOne({ id: officeId });
    if (!office) {
      return res.status(404).json({ erro: "Oficina não encontrada" });
    }

    const { openingHours, closingHours } = office;
    const availableSlots = [];
    let currentSlot = openingHours;
    let slotId = 1;

    while (currentSlot + durationMinutes <= closingHours) {
      const h = Math.floor(currentSlot / 60).toString().padStart(2, '0');
      const m = (currentSlot % 60).toString().padStart(2, '0');

      availableSlots.push({
        id: slotId.toString(),
        hour: `${h}:${m}`,
        startMinutes: currentSlot,
        available: true
      });

      currentSlot += 60;
      slotId++;
    }

    console.log(`🔍 Oficina ${officeId} (${office.name}): ${availableSlots.length} slots`);
    res.json({ availableSlots });
  } catch (err) {
    console.error("❌ checkAvailability:", err);
    res.status(500).json({ erro: err.message });
  }
};

// ✅ Criar nova marcação
export const createAppointment = async (req, res) => {
  try {
    const { vehicleId, officeId, serviceId, date, startMinutes, description } = req.body;
    
    const appointment = await Appointment.create({
      id: Date.now(),
      serviceId,
      officeId: Number(officeId),
      userId: 1,
      date: new Date(date),
      time: startMinutes,
      durationMinutes: 60,
      status: "PENDING"
    });

    console.log("✅ Marcação criada:", appointment.id);
    res.status(201).json({ 
      message: "Marcação criada com sucesso!", 
      id: appointment.id 
    });
  } catch (err) {
    console.error("❌ createAppointment:", err);
    res.status(500).json({ erro: err.message });
  }
};

// ✅ Listar marcações do utilizador
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: 1 })
      .sort({ date: -1, time: 1 });

    const services = await Service.find({}, { _id: 1, name: 1 });
    const serviceMap = {};
    services.forEach(s => serviceMap[s._id.toString()] = { 
      _id: s._id, 
      name: s.name 
    });

    const offices = await Office.find({}, { id: 1, name: 1 });
    const officeMap = {};
    offices.forEach(o => officeMap[o.id] = { 
      id: o.id, 
      name: o.name 
    });

    const formattedAppointments = appointments.map(appointment => ({
      ...appointment._doc,
      _id: appointment._doc._id.toString(),
      statusId: { label: appointment.status },
      startMinutes: appointment.time,
      serviceId: serviceMap[appointment.serviceId] || { name: "Serviço Desconhecido" },
      officeId: officeMap[appointment.officeId] || { name: "Oficina Desconhecida" }
    }));

    console.log(`🔍 ${formattedAppointments.length} marcações completas`);
    res.json(formattedAppointments);
  } catch (err) {
    console.error("❌ getMyAppointments:", err);
    res.status(500).json({ erro: err.message });
  }
};

// ✅ NOVA FUNÇÃO - Marcação da oficina do user logado (RESOLVE 404)
// ✅ getOfficeAppointments - CORRIGIDO
export const getOfficeAppointments = async (req, res) => {
  try {
    console.log('👤 req.user:', req.user);
    
    const officeObjectId = req.user?.office;  // ← ObjectId da oficina
    
    if (!officeObjectId) {
      return res.status(400).json({ erro: "Utilizador sem oficina associada" });
    }

    // ✅ BUSCA a oficina para PEGAR o NUMBER id
    const office = await Office.findById(officeObjectId);
    if (!office) {
      return res.status(404).json({ erro: "Oficina não encontrada" });
    }

    const officeIdNumber = office.id;  // ← 1770842299574 (NUMBER!)
    
    console.log('🏢 officeId NUMBER:', officeIdNumber);
    
    const appointments = await Appointment.find({ officeId: officeIdNumber }).populate('serviceId');
    console.log(`✅ ${appointments.length} marcações encontradas`);
    
    res.json(appointments);
    
  } catch (err) {
    console.error("❌ ERRO:", err);
    res.status(500).json({ erro: err.message });
  }
};
