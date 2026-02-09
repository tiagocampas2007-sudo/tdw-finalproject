// controllers/officeController.js - FICHEIRO COMPLETO COM ROLE ADMIN
import Office from "../models/Office.js";
import User from "../models/User.js";
import UserRole from "../models/UserRole.js";
import bcrypt from "bcryptjs";

export const createOffice = async (req, res) => {
  try {
    console.log("🏢 DADOS:", req.body);
    
    const { name, email, password, officeName, location, phone, openingHours, closingHours } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e password obrigatórios" });
    }

    // 1️⃣ CRIA USER COM ROLE ADMIN (Dono de oficina)
    const emailLower = email.toLowerCase();
    let user = await User.findOne({ email: emailLower });
    
    if (!user) {
      // 🔥 ADMIN ROLE para donos de oficina
      let adminRole = await UserRole.findOne({ role: "ADMIN" });
      if (!adminRole) {
        adminRole = await UserRole.create({ role: "ADMIN" });
        console.log("✅ Role ADMIN criado:", adminRole._id);
      }
      
      const hashed = await bcrypt.hash(password, 10);
      
      user = await User.create({
        name: name || officeName || "Admin Oficina",
        email: emailLower,
        password: hashed,
        role: adminRole._id,  // ← ADMIN para oficina!
        office: null
      });
      console.log("✅ ADMIN CRIADO para oficina:", user._id);
    }

    // 2️⃣ CRIA OFICINA
    const officeData = {
      id: Date.now(),
      name: officeName || name || "Nova Oficina",
      location: location || "Aveiro",
      contact: phone?.toString() || "999999999",
      openingHours: Number(openingHours) || 900,
      closingHours: Number(closingHours) || 1800
    };

    const office = await Office.create(officeData);
    
    // 3️⃣ ASSOCIA user à oficina
    user.office = office._id;
    await user.save();
    
    console.log("✅ OFICINA + ADMIN:", office.id);
    
    res.status(201).json({
      success: true,
      message: "Admin de oficina + oficina criadas!",
      office: {
        id: office.id,
        name: office.name,
        location: office.location
      },
      login: {
        email: user.email,
        password: password,
        role: "ADMIN"  // ← Confirmação para frontend
      }
    });
    
  } catch (err) {
    console.error("💥 ERRO:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllOffices = async (req, res) => {
  try {
    const offices = await Office.find({})
      .populate('manager', 'name email role')
      .select('id name location contact openingHours closingHours');
    res.json({ success: true, offices });
  } catch (err) {
    console.error("❌ getAllOffices:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Office.findOneAndUpdate(
      { id: Number(id) }, 
      req.body, 
      { new: true }
    ).populate('manager', 'name email');
    
    if (!updated) {
      return res.status(404).json({ error: "Oficina não encontrada" });
    }
    
    res.json({ success: true, office: updated });
  } catch (err) {
    console.error("❌ updateOffice:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Office.findOneAndDelete({ id: Number(id) });
    
    if (!deleted) {
      return res.status(404).json({ error: "Oficina não encontrada" });
    }
    
    res.json({ success: true, message: "Oficina eliminada" });
  } catch (err) {
    console.error("❌ deleteOffice:", err);
    res.status(500).json({ error: err.message });
  }
};
