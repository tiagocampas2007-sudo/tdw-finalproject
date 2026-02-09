import Mechanic from "../models/Mechanic.js";
import User from "../models/User.js";

// ✅ Candidatar-se como mecânico
export const applyMechanic = async (req, res) => {
  try {
    const { specialties } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        erro: 'Utilizador não autorizado' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          mechanic: true,
          specialties: specialties 
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        erro: 'Utilizador não encontrado' 
      });
    }

    res.json({ 
      success: true,
      message: 'Candidatura submetida com sucesso!',
      mechanicId: updatedUser._id 
    });
  } catch (error) {
    console.error('Erro applyMechanic:', error);
    res.status(500).json({ 
      success: false, 
      erro: 'Erro interno do servidor' 
    });
  }
};

// ✅ Criar mecânico
export const createMechanic = async (req, res) => {
  try {
    const { id, userId, officeId } = req.body;
    const mechanic = await Mechanic.create({ id, userId, officeId });
    res.status(201).json(mechanic);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ✅ Atualizar mecânico
export const updateMechanic = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    const updated = await Mechanic.findOneAndUpdate({ id: mechanicId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ erro: "Mecânico não encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ✅ Eliminar mecânico
export const deleteMechanic = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    const deleted = await Mechanic.findOneAndDelete({ id: mechanicId });
    if (!deleted) return res.status(404).json({ erro: "Mecânico não encontrado" });
    res.json({ message: "Mecânico eliminado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ✅ NOVA FUNÇÃO - Mecânicos da oficina do user logado (RESOLVE 404)
export const getMechanicsByOffice = async (req, res) => {
  try {
    console.log('👤 User logado:', req.user);
    
    const officeId = req.user.office?.toString();
    
    if (!officeId) {
      return res.status(400).json({ erro: "Utilizador sem oficina associada" });
    }

    const mechanics = await Mechanic.find({ 
      officeId: Number(officeId) 
    }).populate('userId');

    console.log(`✅ ${mechanics.length} mecânicos na oficina ${officeId}`);
    res.json(mechanics);
    
  } catch (err) {
    console.error("❌ getMechanicsByOffice:", err);
    res.status(500).json({ erro: err.message });
  }
};
